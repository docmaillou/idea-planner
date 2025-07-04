// PATTERN: Hook for adding new ideas with optimistic updates
import { useState, useCallback } from 'react';
import { supabase, supabaseHelpers } from '../services/supabase';
import { UseAddIdeaResult } from '../types';
import { SUPABASE_TABLES, ERROR_MESSAGES } from '../utils/constants';

export function useAddIdea(): UseAddIdeaResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PATTERN: Add new idea with validation
  const addIdea = useCallback(async (title: string, description?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // PATTERN: Validate input
      if (!title.trim()) {
        setError(ERROR_MESSAGES.VALIDATION_ERROR);
        return false;
      }

      // PATTERN: Get current user or create anonymous session
      let user = await supabaseHelpers.getCurrentUser();
      if (!user) {
        const { user: anonymousUser } = await supabaseHelpers.signInAnonymously();
        user = anonymousUser;
      }

      if (!user) {
        throw new Error('Unable to authenticate user');
      }

      // PATTERN: Insert new idea
      const { data, error: insertError } = await supabase
        .from(SUPABASE_TABLES.IDEAS)
        .insert([
          {
            title: title.trim(),
            description: description?.trim() || null,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

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