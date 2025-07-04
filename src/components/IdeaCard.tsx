// PATTERN: Individual idea display component with React Native Paper
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme, Chip } from "react-native-paper";
import { Idea } from "../types";

interface IdeaCardProps {
  idea: Idea;
  onPress?: () => void;
}

// PATTERN: Memoized component for performance optimization
export const IdeaCard: React.FC<IdeaCardProps> = React.memo(
  ({ idea, onPress }) => {
    const theme = useTheme();

    // PATTERN: Format date for display
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // PATTERN: Get rating color based on value
    const getRatingColor = (rating: number) => {
      if (rating >= 0 && rating <= 3) {
        return "#ef4444"; // Rouge
      } else if (rating >= 4 && rating <= 7) {
        return "#f59e0b"; // Jaune/Orange
      } else if (rating >= 8 && rating <= 10) {
        return "#22c55e"; // Vert
      }
      return theme.colors.outline; // Fallback
    };

    return (
      <Card style={styles.card} onPress={onPress}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
              {idea.title}
            </Text>
            <View style={styles.headerRight}>
              {idea.rating !== undefined && idea.rating >= 0 && (
                <Chip
                  style={[
                    styles.ratingChip,
                    { backgroundColor: getRatingColor(idea.rating) },
                  ]}
                  textStyle={[styles.ratingText, { color: "#ffffff" }]}
                  compact
                >
                  {idea.rating}
                </Chip>
              )}
              <Text
                variant="labelSmall"
                style={[styles.date, { color: theme.colors.outline }]}
              >
                {formatDate(idea.created_at)}
              </Text>
            </View>
          </View>

          {idea.description && (
            <Text
              variant="bodyMedium"
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={3}
            >
              {idea.description}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  }
);

IdeaCard.displayName = "IdeaCard";

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 3,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#0066ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    marginRight: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  ratingChip: {
    height: 28,
    borderRadius: 14,
    minWidth: 28,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  date: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "500",
  },
  description: {
    marginTop: 6,
    lineHeight: 22,
  },
});
