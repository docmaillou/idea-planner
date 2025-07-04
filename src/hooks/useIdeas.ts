// PATTERN: Data fetching hook with pagination and real-time subscriptions
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Idea, UseIdeasResult } from '../types';
import { APP_CONSTANTS, SUPABASE_TABLES, ERROR_MESSAGES } from '../utils/constants';

export function useIdeas(): UseIdeasResult {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // PATTERN: Fetch ideas with pagination
  const fetchIdeas = useCallback(async (pageNum: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      // PATTERN: Supabase pagination with offset
      const { data, error: fetchError } = await supabase
        .from(SUPABASE_TABLES.IDEAS)
        .select('*')
        .order('created_at', { ascending: false })
        .range(
          pageNum * APP_CONSTANTS.PAGINATION_LIMIT,
          (pageNum + 1) * APP_CONSTANTS.PAGINATION_LIMIT - 1
        );

      if (fetchError) {
        throw fetchError;
      }

      // CRITICAL: Handle pagination state
      if (data) {
        setIdeas(prev => pageNum === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === APP_CONSTANTS.PAGINATION_LIMIT);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError(ERROR_MESSAGES.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  // PATTERN: Refresh ideas (pull-to-refresh)
  const refreshIdeas = useCallback(async () => {
    setPage(0);
    setHasMore(true);
    await fetchIdeas(0);
  }, [fetchIdeas]);

  // PATTERN: Load more ideas (infinite scroll)
  const loadMoreIdeas = useCallback(async () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      await fetchIdeas(nextPage);
    }
  }, [loading, hasMore, page, fetchIdeas]);

  // PATTERN: Real-time subscription for new ideas
  useEffect(() => {
    // Initial fetch
    fetchIdeas(0);

    // PATTERN: Set up real-time subscription
    const channel = supabase
      .channel('ideas_channel')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: SUPABASE_TABLES.IDEAS 
        },
        (payload) => {
          const newIdea = payload.new as Idea;
          setIdeas(prev => [newIdea, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: SUPABASE_TABLES.IDEAS 
        },
        (payload) => {
          const updatedIdea = payload.new as Idea;
          setIdeas(prev => prev.map(idea => 
            idea.id === updatedIdea.id ? updatedIdea : idea
          ));
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: SUPABASE_TABLES.IDEAS 
        },
        (payload) => {
          const deletedIdea = payload.old as Idea;
          setIdeas(prev => prev.filter(idea => idea.id !== deletedIdea.id));
        }
      )
      .subscribe();

    // GOTCHA: Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [fetchIdeas]);

  return {
    ideas,
    loading,
    hasMore,
    page,
    fetchIdeas: loadMoreIdeas,
    refreshIdeas,
    error,
  };
}