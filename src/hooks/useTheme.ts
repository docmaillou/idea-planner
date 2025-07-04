import { useThemeContext } from '../context/ThemeContext';
import { availableThemes } from '../services/themeService';

export interface UseThemeResult {
  currentTheme: any;
  availableThemes: any[];
  setTheme: (themeId: string) => Promise<void>;
  loading: boolean;
}

export function useAppTheme(): UseThemeResult {
  const { currentTheme, setTheme } = useThemeContext();

  return {
    currentTheme,
    availableThemes,
    setTheme,
    loading: false,
  };
}