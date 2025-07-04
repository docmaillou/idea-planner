// PATTERN: Main ideas list screen with infinite scroll and FAB
import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Idea } from '../types';
import { IdeaList } from '../components/IdeaList';
import { IdeaFilters, FilterOptions } from '../components/IdeaFilters';
import { useIdeas } from '../hooks/useIdeas';

type IdeasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const IdeasScreen: React.FC = () => {
  const { ideas, loading, hasMore, fetchIdeas, refreshIdeas, error } = useIdeas();
  const [refreshing, setRefreshing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'date',
    sortOrder: 'desc',
    searchQuery: '',
  });
  const navigation = useNavigation<IdeasScreenNavigationProp>();
  const { t } = useTranslation();

  // PATTERN: Filter and sort ideas
  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = [...ideas];

    // Filter by search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((idea) => {
        const titleMatch = idea.title.toLowerCase().includes(query);
        const descriptionMatch = idea.description?.toLowerCase().includes(query) || false;
        return titleMatch || descriptionMatch;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return filters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return filters.sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
      }
    });

    return filtered;
  }, [ideas, filters]);

  // PATTERN: Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshIdeas();
    setRefreshing(false);
  };

  // PATTERN: Handle load more (infinite scroll)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchIdeas();
    }
  };

  // PATTERN: Show error snackbar when error occurs
  React.useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  // PATTERN: Refresh ideas when screen comes into focus (after adding new idea)
  useFocusEffect(
    React.useCallback(() => {
      refreshIdeas();
    }, [refreshIdeas])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <IdeaFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
        <IdeaList
          ideas={filteredAndSortedIdeas}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddIdea')}
        label={t('add')}
        size="medium"
      />

      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        duration={4000}
        action={{
          label: t('retry'),
          onPress: () => {
            setErrorVisible(false);
            refreshIdeas();
          },
        }}
      >
        {error || t('loadError')}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});