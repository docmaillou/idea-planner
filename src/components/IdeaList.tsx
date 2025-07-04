// PATTERN: FlatList with infinite scroll optimization
import React, { useCallback, useMemo } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, ListRenderItem } from 'react-native';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { IdeaCard } from './IdeaCard';
import { Idea } from '../types';

interface IdeaListProps {
  ideas: Idea[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
}

export const IdeaList: React.FC<IdeaListProps> = ({
  ideas,
  loading,
  hasMore,
  onLoadMore,
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();

  // PATTERN: Memoized render item function to prevent re-renders
  const renderItem: ListRenderItem<Idea> = useCallback(({ item }) => (
    <IdeaCard idea={item} />
  ), []);

  // PATTERN: Memoized key extractor for performance
  const keyExtractor = useCallback((item: Idea) => item.id, []);

  // PATTERN: Memoized empty state component
  const EmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text variant="titleMedium" style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}>
        No ideas yet
      </Text>
      <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.outline }]}>
        Tap the + button to add your first idea
      </Text>
    </View>
  ), [theme.colors.onSurfaceVariant, theme.colors.outline]);

  // PATTERN: Memoized footer component with loading indicator
  const FooterComponent = useMemo(() => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator animating={true} size="small" />
        <Text variant="bodySmall" style={[styles.loadingText, { color: theme.colors.outline }]}>
          Loading more ideas...
        </Text>
      </View>
    );
  }, [loading, theme.colors.outline]);

  // GOTCHA: Debounced onEndReached to prevent multiple calls
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  // PATTERN: Optimized FlatList configuration
  return (
    <FlatList
      data={ideas}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={EmptyComponent}
      ListFooterComponent={FooterComponent}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      // PATTERN: Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      getItemLayout={undefined} // Let FlatList calculate since card heights may vary
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
  },
});