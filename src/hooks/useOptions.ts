import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { OptionsResponse } from '../types/api';

interface UseOptionsResult {
  data: OptionsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

// Cache options for 24 hours as they change infrequently
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
let cachedOptions: OptionsResponse | null = null;
let cacheTimestamp: Date | null = null;

export function useOptions(): UseOptionsResult {
  const [data, setData] = useState<OptionsResponse | null>(cachedOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(cacheTimestamp);

  const fetchOptions = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cachedOptions && cacheTimestamp) {
      const cacheAge = Date.now() - cacheTimestamp.getTime();
      if (cacheAge < CACHE_DURATION) {
        setData(cachedOptions);
        setLastUpdated(cacheTimestamp);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getOptions();
      
      // Update cache
      cachedOptions = result;
      cacheTimestamp = new Date();
      
      setData(result);
      setLastUpdated(cacheTimestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch options');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchOptions(true),
    lastUpdated,
  };
}