import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { BalanceResponse } from '../types/api';

interface UseBalanceResult {
  data: BalanceResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useBalance(month?: string): UseBalanceResult {
  const [data, setData] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getBalance(month);
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    data,
    loading,
    error,
    refetch: fetchBalance,
    lastUpdated,
  };
}