// PATTERN: Main ideas list screen with infinite scroll and FAB
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { IdeaList } from '../components/IdeaList';
import { useIdeas } from '../hooks/useIdeas';

type IdeasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const IdeasScreen: React.FC = () => {
  const { ideas, loading, hasMore, fetchIdeas, refreshIdeas, error } = useIdeas();
  const [refreshing, setRefreshing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const navigation = useNavigation<IdeasScreenNavigationProp>();
  const { t } = useTranslation();

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
        <IdeaList
          ideas={ideas}
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
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});