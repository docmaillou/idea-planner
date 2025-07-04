// PATTERN: Individual idea display component with React Native Paper
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onPress?: () => void;
}

// PATTERN: Memoized component for performance optimization
export const IdeaCard: React.FC<IdeaCardProps> = React.memo(({ idea, onPress }) => {
  const theme = useTheme();

  // PATTERN: Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {idea.title}
          </Text>
          <Text variant="labelSmall" style={[styles.date, { color: theme.colors.outline }]}>
            {formatDate(idea.created_at)}
          </Text>
        </View>
        
        {idea.description && (
          <Text 
            variant="bodyMedium" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={3}
          >
            {idea.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
});

IdeaCard.displayName = 'IdeaCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
  description: {
    marginTop: 4,
    lineHeight: 20,
  },
});