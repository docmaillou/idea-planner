// PATTERN: App constants for configuration
export const APP_CONSTANTS = {
  PAGINATION_LIMIT: 10,
  DEBOUNCE_DELAY: 300,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  RETRY_ATTEMPTS: 3,
  TIMEOUT_DURATION: 10000,
} as const;

// PATTERN: Local storage keys
export const STORAGE_KEYS_LOCAL = {
  IDEAS: 'ideas_storage',
} as const;

// PATTERN: Storage keys
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  OFFLINE_IDEAS: 'offline_ideas',
} as const;

// PATTERN: Error messages
export const ERROR_MESSAGES = {
  SAVE_ERROR: 'Failed to save idea. Please try again.',
  LOAD_ERROR: 'Failed to load ideas. Please try again.',
  VALIDATION_ERROR: 'Please fill in all required fields.',
} as const;