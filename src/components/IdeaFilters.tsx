import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text, Chip, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export interface FilterOptions {
  sortBy: 'date' | 'rating';
  sortOrder: 'asc' | 'desc';
}

interface IdeaFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const IdeaFilters: React.FC<IdeaFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSortChange = (sortBy: 'date' | 'rating', sortOrder: 'asc' | 'desc') => {
    onFiltersChange({ sortBy, sortOrder });
    setMenuVisible(false);
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const getSortLabel = () => {
    if (filters.sortBy === 'date') {
      return filters.sortOrder === 'desc' ? t('newestFirst') : t('oldestFirst');
    } else {
      return filters.sortOrder === 'desc' ? t('highestRated') : t('lowestRated');
    }
  };

  const hasActiveFilters = filters.sortBy !== 'date' || 
    filters.sortOrder !== 'desc';

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {/* Sort Filter */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Chip
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.filterChip}
              compact
            >
              {getSortLabel()}
            </Chip>
          }
        >
          <Menu.Item
            onPress={() => handleSortChange('date', 'desc')}
            title={t('newestFirst')}
          />
          <Menu.Item
            onPress={() => handleSortChange('date', 'asc')}
            title={t('oldestFirst')}
          />
          <Menu.Item
            onPress={() => handleSortChange('rating', 'desc')}
            title={t('highestRated')}
          />
          <Menu.Item
            onPress={() => handleSortChange('rating', 'asc')}
            title={t('lowestRated')}
          />
        </Menu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            mode="text"
            onPress={clearFilters}
            textColor={theme.colors.outline}
            compact
          >
            {t('clearFilters')}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    height: 32,
  },
});