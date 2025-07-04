import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ColorTheme } from '../services/themeService';

interface ThemeSelectorProps {
  themes: ColorTheme[];
  currentTheme: ColorTheme;
  onThemeSelect: (themeId: string) => Promise<void>;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  onThemeSelect,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const getThemeName = (themeId: string): string => {
    switch (themeId) {
      case 'blue': return t('themeBlue');
      case 'orange': return t('themeOrange');
      case 'green': return t('themeGreen');
      case 'purple': return t('themePurple');
      case 'pink': return t('themePink');
      default: return themeId;
    }
  };

  const ColorPreview: React.FC<{ color: string; isSelected: boolean }> = ({ color, isSelected }) => (
    <View style={[
      styles.colorPreview,
      { backgroundColor: color },
      isSelected && { borderColor: theme.colors.onSurface, borderWidth: 2 }
    ]} />
  );

  return (
    <View>
      {themes.map((themeOption) => (
        <TouchableOpacity
          key={themeOption.id}
          onPress={() => onThemeSelect(themeOption.id)}
          style={styles.themeItem}
        >
          <List.Item
            title={getThemeName(themeOption.id)}
            left={() => (
              <View style={styles.colorContainer}>
                <ColorPreview 
                  color={themeOption.colors.primary} 
                  isSelected={currentTheme.id === themeOption.id}
                />
                <ColorPreview 
                  color={themeOption.colors.accent} 
                  isSelected={false}
                />
              </View>
            )}
            right={(props) =>
              currentTheme.id === themeOption.id ? (
                <List.Icon
                  {...props}
                  icon="check"
                  color={theme.colors.primary}
                />
              ) : null
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  themeItem: {
    marginVertical: 2,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 4,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});