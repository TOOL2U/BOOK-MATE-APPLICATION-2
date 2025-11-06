import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import type { PostSheetsRequest, PostSheetsResponse } from '../types/api';

interface UsePostTransactionResult {
  submitTransaction: (payload: PostSheetsRequest) => Promise<PostSheetsResponse>;
  loading: boolean;
  error: string | null;
  lastSubmission: Date | null;
}

export function usePostTransaction(): UsePostTransactionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null);

  const submitTransaction = useCallback(async (payload: PostSheetsRequest): Promise<PostSheetsResponse> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.postSheets(payload);
      setLastSubmission(new Date());
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitTransaction,
    loading,
    error,
    lastSubmission,
  };
}