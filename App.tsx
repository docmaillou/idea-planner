// PATTERN: Main App component with providers, navigation and i18n
import 'react-native-url-polyfill/auto'; // URL polyfill for React Native
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/i18n'; // Initialize i18n
import { AppNavigator } from './src/navigation/AppNavigator';

// PATTERN: Bright, inspiring theme for idea creation
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary: Bright inspiring blue for creativity
    primary: '#0066ff',
    primaryContainer: '#e6f2ff',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#003366',
    
    // Secondary: Energetic orange for innovation  
    secondary: '#ff6600',
    secondaryContainer: '#fff2e6',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#cc3300',
    
    // Tertiary: Creative purple for inspiration
    tertiary: '#8b5cf6',
    tertiaryContainer: '#f3f0ff',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#4c1d95',
    
    // Surface colors: Clean, bright whites
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    
    // Background: Pure bright white
    background: '#ffffff',
    onBackground: '#0f172a',
    
    // Success green for completed ideas
    success: '#10b981',
    onSuccess: '#ffffff',
    
    // Error: Bright but not harsh red
    error: '#ef4444',
    errorContainer: '#fef2f2',
    onError: '#ffffff',
    onErrorContainer: '#991b1b',
    
    // Outline colors
    outline: '#cbd5e1',
    outlineVariant: '#e2e8f0',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}