import React, { createContext, useContext, useEffect, useState } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { ColorTheme, themeService } from '../services/themeService';

interface ThemeContextType {
  currentTheme: ColorTheme;
  setTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>({
    id: 'blue',
    name: 'Blue',
    colors: {
      primary: '#0066ff',
      primaryContainer: '#e6f2ff',
      secondary: '#1976d2',
      background: '#ffffff',
      surface: '#f8fafc',
      accent: '#2196f3',
    },
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await themeService.getCurrentTheme();
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (themeId: string): Promise<void> => {
    try {
      await themeService.setTheme(themeId);
      const newTheme = themeService.getThemeById(themeId);
      if (newTheme) {
        setCurrentTheme(newTheme);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  };

  // Create Paper theme with custom colors
  const paperTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: currentTheme.colors.primary,
      primaryContainer: currentTheme.colors.primaryContainer,
      secondary: currentTheme.colors.secondary,
      background: currentTheme.colors.background,
      surface: currentTheme.colors.surface,
      onPrimary: '#ffffff',
      onPrimaryContainer: currentTheme.colors.primary,
      onSecondary: '#ffffff',
      onBackground: '#0f172a',
      onSurface: '#0f172a',
    },
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};