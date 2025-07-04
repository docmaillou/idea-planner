// PATTERN: Data fetching hook with pagination and local storage
import { useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../services/localStorage';
import { Idea, UseIdeasResult } from '../types';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../utils/constants';

export function useIdeas(): UseIdeasResult {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // PATTERN: Fetch ideas with pagination from local storage
  const fetchIdeas = useCallback(async (pageNum: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      // PATTERN: Local storage pagination with offset
      const offset = pageNum * APP_CONSTANTS.PAGINATION_LIMIT;
      const data = await localStorageService.getIdeasPaginated(offset, APP_CONSTANTS.PAGINATION_LIMIT);

      // CRITICAL: Handle pagination state
      if (data) {
        setIdeas(prev => pageNum === 0 ? data : [...prev, ...data]);
        // Only set hasMore to true if we received a full page of results
        setHasMore(data.length === APP_CONSTANTS.PAGINATION_LIMIT);
        setPage(pageNum);
        
        // If we received fewer results than requested, we've reached the end
        if (data.length < APP_CONSTANTS.PAGINATION_LIMIT) {
          setHasMore(false);
        }
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

  // PATTERN: Initial data fetch on component mount
  useEffect(() => {
    fetchIdeas(0);
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