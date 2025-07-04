import { useState, useCallback } from 'react';
import { localStorageService } from '../services/localStorage';
import { ERROR_MESSAGES } from '../utils/constants';

export interface UseUpdateIdeaResult {
  updateIdea: (id: string, title: string, description?: string, rating?: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useUpdateIdea(): UseUpdateIdeaResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateIdea = useCallback(async (
    id: string, 
    title: string, 
    description?: string, 
    rating?: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // PATTERN: Validate input
      if (!title.trim()) {
        setError(ERROR_MESSAGES.VALIDATION_ERROR);
        return false;
      }

      // PATTERN: Update in local storage
      await localStorageService.updateIdea(id, {
        title: title.trim(),
        description: description?.trim() || null,
        rating: rating,
      });

      return true;
    } catch (err) {
      console.error('Error updating idea:', err);
      setError(ERROR_MESSAGES.SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateIdea,
    loading,
    error,
  };
}