// PATTERN: Hook for adding new ideas with local storage
import { useState, useCallback } from 'react';
import { localStorageService } from '../services/localStorage';
import { UseAddIdeaResult } from '../types';
import { ERROR_MESSAGES } from '../utils/constants';

export function useAddIdea(): UseAddIdeaResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PATTERN: Add new idea with validation to local storage
  const addIdea = useCallback(async (title: string, description?: string, rating?: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // PATTERN: Validate input
      if (!title.trim()) {
        setError(ERROR_MESSAGES.VALIDATION_ERROR);
        return false;
      }

      // PATTERN: Add to local storage
      const ideaData = {
        title: title.trim(),
        description: description?.trim() || null,
        rating: rating !== undefined ? rating : undefined,
      };
      
      await localStorageService.addIdea(ideaData);

      // CRITICAL: Return success status
      return true;
    } catch (err) {
      console.error('Error adding idea:', err);
      setError(ERROR_MESSAGES.SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addIdea,
    loading,
    error,
  };
}