/**
 * Health Service - API Health Check Polling
 * 
 * Polls /api/health/balance endpoint every 30 seconds to check sync status.
 * Rate limit: 200 requests/min (highest tier)
 * Response time: ~150ms average
 * 
 * Based on webapp team recommendations (MOBILE_INTEGRATION_CONFIRMATION.md)
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

export interface HealthStatus {
  isHealthy: boolean;
  lastSync?: string;
  accountCount?: number;
  timestamp: Date;
  error?: string;
}

export type HealthStatusCallback = (status: HealthStatus) => void;

class HealthService {
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly API_BASE = API_CONFIG.BASE_URL.replace('/api', ''); // Remove /api suffix
  private readonly POLL_INTERVAL = 30000; // 30 seconds
  private isPolling = false;

  /**
   * Start polling health endpoint
   * @param onStatusChange Callback when health status changes
   */
  startHealthPolling(onStatusChange: HealthStatusCallback): void {
    if (this.isPolling) {
      console.log('Health polling already active');
      return;
    }

    console.log('Starting health polling (30s interval)...');
    this.isPolling = true;

    // Initial check
    this.checkHealth(onStatusChange);

    // Set up polling interval
    this.pollingInterval = setInterval(async () => {
      await this.checkHealth(onStatusChange);
    }, this.POLL_INTERVAL);
  }

  /**
   * Stop polling health endpoint
   */
  stopHealthPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.isPolling = false;
      console.log('Health polling stopped');
    }
  }

  /**
   * Check health status once
   */
  private async checkHealth(onStatusChange: HealthStatusCallback): Promise<void> {
    try {
      const deviceId = await this.getDeviceId();
      
      const response = await fetch(`${this.API_BASE}/api/health/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': Platform.OS,
          'X-Client-Version': '1.0.2',
          'X-Device-ID': deviceId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        const status: HealthStatus = {
          isHealthy: data.ok === true,
          lastSync: data.lastSync,
          accountCount: data.syncedAccounts,
          timestamp: new Date(),
        };

        onStatusChange(status);
        
        // Cache last known good status
        await this.cacheHealthStatus(status);
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      
      const errorStatus: HealthStatus = {
        isHealthy: false,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      onStatusChange(errorStatus);
    }
  }

  /**
   * Get or create device ID
   */
  private async getDeviceId(): Promise<string> {
    const DEVICE_ID_KEY = '@bookmate_device_id';
    
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = this.generateUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  }

  /**
   * Generate UUID for device ID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Cache last health status
   */
  private async cacheHealthStatus(status: HealthStatus): Promise<void> {
    try {
      await AsyncStorage.setItem(
        '@bookmate_last_health_status',
        JSON.stringify(status)
      );
    } catch (error) {
      console.error('Failed to cache health status:', error);
    }
  }

  /**
   * Get cached health status
   */
  async getCachedHealthStatus(): Promise<HealthStatus | null> {
    try {
      const cached = await AsyncStorage.getItem('@bookmate_last_health_status');
      if (cached) {
        const status = JSON.parse(cached);
        status.timestamp = new Date(status.timestamp);
        return status;
      }
    } catch (error) {
      console.error('Failed to get cached health status:', error);
    }
    return null;
  }

  /**
   * Check if currently polling
   */
  isActivelyPolling(): boolean {
    return this.isPolling;
  }
}

export default new HealthService();
