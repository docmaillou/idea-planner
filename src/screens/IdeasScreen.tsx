// PATTERN: Main ideas list screen with infinite scroll
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaList } from '../components/IdeaList';
import { useIdeas } from '../hooks/useIdeas';

export const IdeasScreen: React.FC = () => {
  const { ideas, loading, hasMore, fetchIdeas, refreshIdeas, error } = useIdeas();
  const [refreshing, setRefreshing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

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

      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        duration={4000}
        action={{
          label: 'Retry',
          onPress: () => {
            setErrorVisible(false);
            refreshIdeas();
          },
        }}
      >
        {error || 'Something went wrong'}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});