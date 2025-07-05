// PATTERN: Main App component with providers, navigation and i18n
import 'react-native-url-polyfill/auto'; // URL polyfill for React Native
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/i18n'; // Initialize i18n
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { AutoBanner } from './src/components/AutoBanner';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <AppNavigator />
        <AutoBanner 
          showDelay={30000}  // Apparaît après 30 secondes
          hideDelay={30000}  // Reste visible 30 secondes
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}