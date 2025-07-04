import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';

interface RatingSelectorProps {
  rating?: number;
  onRatingChange: (rating: number) => void;
}

export const RatingSelector: React.FC<RatingSelectorProps> = ({
  rating,
  onRatingChange,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text variant="titleMedium" style={styles.label}>
          {t('rating')} ({t('optional')})
        </Text>
        {rating !== undefined && (
          <Text variant="titleMedium" style={[styles.ratingValue, { color: theme.colors.primary }]}>
            {rating}/10
          </Text>
        )}
      </View>
      
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={rating || 0}
          onValueChange={(value) => {
            console.log('Rating changed to:', value);
            onRatingChange(value);
          }}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.outline}
          thumbStyle={{ backgroundColor: theme.colors.primary }}
        />
        <View style={styles.sliderLabels}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>0</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>10</Text>
        </View>
      </View>

      {rating !== undefined && rating > 0 && (
        <View style={styles.clearContainer}>
          <Button
            mode="text"
            onPress={() => onRatingChange(0)}
            textColor={theme.colors.outline}
            compact
          >
            {t('clearRating')}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
  },
  ratingValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  sliderContainer: {
    marginHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    paddingHorizontal: 8,
  },
  clearContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
});