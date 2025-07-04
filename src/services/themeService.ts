import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'app_theme';

export interface ColorTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
}

export const availableThemes: ColorTheme[] = [
  {
    id: 'blue',
    name: 'Bleu',
    colors: {
      primary: '#0066ff',
      primaryContainer: '#e6f2ff',
      secondary: '#1976d2',
      background: '#ffffff',
      surface: '#f8fafc',
      accent: '#2196f3',
    },
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: '#ff6b35',
      primaryContainer: '#fff4f0',
      secondary: '#ff8a50',
      background: '#ffffff',
      surface: '#fffaf8',
      accent: '#ff7043',
    },
  },
  {
    id: 'green',
    name: 'Vert',
    colors: {
      primary: '#10b981',
      primaryContainer: '#ecfdf5',
      secondary: '#059669',
      background: '#ffffff',
      surface: '#f0fdf4',
      accent: '#34d399',
    },
  },
  {
    id: 'purple',
    name: 'Violet',
    colors: {
      primary: '#8b5cf6',
      primaryContainer: '#f3f4f6',
      secondary: '#7c3aed',
      background: '#ffffff',
      surface: '#faf5ff',
      accent: '#a78bfa',
    },
  },
  {
    id: 'pink',
    name: 'Rose',
    colors: {
      primary: '#ec4899',
      primaryContainer: '#fdf2f8',
      secondary: '#db2777',
      background: '#ffffff',
      surface: '#fef7f0',
      accent: '#f472b6',
    },
  },
];

export const themeService = {
  // Get current theme
  getCurrentTheme: async (): Promise<ColorTheme> => {
    try {
      const storedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const theme = availableThemes.find(t => t.id === storedThemeId);
      return theme || availableThemes[0]; // Default to blue
    } catch (error) {
      console.error('Error getting current theme:', error);
      return availableThemes[0]; // Default to blue
    }
  },

  // Save theme
  setTheme: async (themeId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  },

  // Get theme by ID
  getThemeById: (themeId: string): ColorTheme | undefined => {
    return availableThemes.find(t => t.id === themeId);
  },
};