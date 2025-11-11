/**
 * useApiClient Hook
 * 
 * React hook for making API requests with automatic error handling
 * and loading states.
 * 
 * Usage:
 * ```tsx
 * const { data, loading, error, execute } = useApiClient();
 * 
 * // In component
 * useEffect(() => {
 *   execute(() => ApiClient.getBalance());
 * }, []);
 * ```
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import ApiClient, { RateLimitError, ApiError } from '../services/ApiClient';

interface UseApiClientResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (apiFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useApiClient = <T = any>(): UseApiClientResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiFn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFn();
      setData(result);
      return result;
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';

      if (err instanceof RateLimitError) {
        errorMessage = err.message;
        
        // Show alert for rate limit
        Alert.alert(
          'Rate Limit Exceeded',
          `Please wait ${Math.ceil(err.waitTime / 1000)} seconds before trying again.`,
          [
            {
              text: 'Retry After Wait',
              onPress: async () => {
                // Wait and retry
                await new Promise((resolve) => setTimeout(resolve, err.waitTime));
                await execute(apiFn);
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else if (err instanceof ApiError) {
        errorMessage = err.message;
        
        // Handle specific error codes
        switch (err.code) {
          case 'INVALID_TOKEN':
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 'UNAUTHORIZED':
            errorMessage = 'You are not authorized to perform this action.';
            break;
          case 'NOT_FOUND':
            errorMessage = 'The requested resource was not found.';
            break;
          case 'VALIDATION_ERROR':
            errorMessage = 'Please check your input and try again.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Network connection failed. Please check your internet connection.';
            break;
        }

        // Show alert for API errors
        Alert.alert('Error', errorMessage);
      } else {
        errorMessage = err instanceof Error ? err.message : 'Unknown error';
        Alert.alert('Error', errorMessage);
      }

      setError(errorMessage);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};
