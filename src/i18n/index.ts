// PATTERN: i18n configuration with English as default
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import { fr } from './locales/fr';
import { en } from './locales/en';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Try to get saved language from storage
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      
      // Fall back to device locale, defaulting to English
      try {
        const locales = getLocales();
        const deviceLanguage = locales && locales[0] && locales[0].languageCode ? locales[0].languageCode : 'en';
        callback(['en', 'fr'].includes(deviceLanguage) ? deviceLanguage : 'en');
      } catch (localeError) {
        console.error('Error getting device locale:', localeError);
        callback('en'); // Default to English
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en'); // Default to English
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('app_language', language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;