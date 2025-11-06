import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { PnLResponse } from '../types/api';

interface UsePnLResult {
  data: PnLResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function usePnL(month?: string): UsePnLResult {
  const [data, setData] = useState<PnLResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPnL = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getPnL(month);
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch P&L');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchPnL();
  }, [fetchPnL]);

  return {
    data,
    loading,
    error,
    refetch: fetchPnL,
    lastUpdated,
  };
}