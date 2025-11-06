import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { LedgerResponse } from '../types/api';

interface UseLedgerResult {
  data: LedgerResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useLedger(month?: string): UseLedgerResult {
  const [data, setData] = useState<LedgerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLedger = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getLedger(month);
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ledger');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  return {
    data,
    loading,
    error,
    refetch: fetchLedger,
    lastUpdated,
  };
}