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
    marginVertical: 6,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '500',
  },
  description: {
    marginTop: 6,
    lineHeight: 22,
  },
});