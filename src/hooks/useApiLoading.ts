"use client";

import { useState, useCallback } from 'react';

interface UseApiLoadingReturn {
  loading: boolean;
  error: string | null;
  execute: <T>(apiCall: () => Promise<T>) => Promise<T | null>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export function useApiLoading(): UseApiLoadingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    setLoading,
    setError,
    clearError
  };
}

// Hook for multiple concurrent API calls
export function useMultipleApiLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const execute = useCallback(async <T>(
    key: string,
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      setErrors(prev => ({ ...prev, [key]: null }));
      
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setErrors(prev => ({ ...prev, [key]: errorMessage }));
      return null;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const isLoading = (key: string) => loadingStates[key] || false;
  const getError = (key: string) => errors[key] || null;
  const clearError = (key: string) => {
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  return {
    execute,
    isLoading,
    getError,
    clearError
  };
}

// Hook for paginated data loading
export function usePaginatedLoading<T>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadData = useCallback(async (
    apiCall: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall(1);
      setData(result.data);
      setHasMore(result.hasMore);
      setPage(1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (
    apiCall: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
  ) => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);
      
      const result = await apiCall(page + 1);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more data';
      setError(errorMessage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadData,
    loadMore,
    reset
  };
}
