import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Button, Menu, Text, Chip, useTheme, TextInput, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export interface FilterOptions {
  sortBy: 'date' | 'rating';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
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
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));

  const handleSortChange = (sortBy: 'date' | 'rating', sortOrder: 'asc' | 'desc') => {
    onFiltersChange({ sortBy, sortOrder });
    setMenuVisible(false);
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'date',
      sortOrder: 'desc',
      searchQuery: '',
    });
  };

  const handleSearchChange = (query: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: query,
    });
  };

  const toggleSearch = () => {
    const toValue = searchVisible ? 0 : 1;
    setSearchVisible(!searchVisible);
    
    Animated.timing(searchAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
    
    // Clear search when hiding
    if (searchVisible && filters.searchQuery) {
      handleSearchChange('');
    }
  };

  const getSortLabel = () => {
    if (filters.sortBy === 'date') {
      return filters.sortOrder === 'desc' ? t('newestFirst') : t('oldestFirst');
    } else {
      return filters.sortOrder === 'desc' ? t('highestRated') : t('lowestRated');
    }
  };

  const hasActiveFilters = filters.sortBy !== 'date' || 
    filters.sortOrder !== 'desc' ||
    filters.searchQuery.length > 0;

  const searchWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {/* Search Icon and Input */}
        <View style={styles.searchContainer}>
          <IconButton
            icon="magnify"
            size={20}
            onPress={toggleSearch}
            style={[styles.searchIcon, { backgroundColor: searchVisible ? theme.colors.primaryContainer : 'transparent' }]}
            iconColor={searchVisible ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          
          <Animated.View style={[styles.searchInputContainer, { width: searchWidth }]}>
            {searchVisible && (
              <TextInput
                mode="outlined"
                placeholder={t('searchIdeas')}
                value={filters.searchQuery}
                onChangeText={handleSearchChange}
                style={styles.searchInput}
                dense
                autoFocus
              />
            )}
          </Animated.View>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  searchIcon: {
    margin: 0,
    borderRadius: 20,
  },
  searchInputContainer: {
    overflow: 'hidden',
  },
  searchInput: {
    height: 40,
    fontSize: 14,
  },
  filterChip: {
    height: 32,
  },
});