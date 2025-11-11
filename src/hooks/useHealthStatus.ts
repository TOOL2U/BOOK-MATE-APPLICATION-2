/**
 * useHealthStatus Hook
 * 
 * React hook for managing health check polling in components.
 * Automatically starts/stops polling based on component lifecycle.
 * 
 * Usage:
 * ```tsx
 * const { isHealthy, lastSync, accountCount, isPolling } = useHealthStatus();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import HealthService, { HealthStatus } from '../services/HealthService';

export const useHealthStatus = (autoStart: boolean = true) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = useCallback(() => {
    if (isPolling) return;

    setIsPolling(true);
    HealthService.startHealthPolling((status) => {
      setHealthStatus(status);
    });
  }, [isPolling]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    HealthService.stopHealthPolling();
  }, []);

  useEffect(() => {
    if (autoStart) {
      startPolling();
    }

    // Load cached status on mount
    HealthService.getCachedHealthStatus().then((cached) => {
      if (cached) {
        setHealthStatus(cached);
      }
    });

    return () => {
      stopPolling();
    };
  }, [autoStart, startPolling, stopPolling]);

  return {
    isHealthy: healthStatus?.isHealthy ?? false,
    lastSync: healthStatus?.lastSync,
    accountCount: healthStatus?.accountCount,
    error: healthStatus?.error,
    timestamp: healthStatus?.timestamp,
    isPolling,
    startPolling,
    stopPolling,
  };
};
