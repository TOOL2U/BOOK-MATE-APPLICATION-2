/**
 * API Client - Enhanced API client with Authentication & Multi-Tenant Support
 * 
 * Features:
 * - JWT Token Authentication (Authorization: Bearer <token>)
 * - Automatic rate limit handling (429 errors)
 * - Session expiration handling (401 errors)
 * - Client-side caching with account isolation
 * - Request headers (platform, version, device ID)
 * - Error handling with user-friendly messages
 * 
 * Based on webapp team multi-tenant integration guide (Nov 14, 2025)
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';
import { getToken, clearSession } from './authService';

/**
 * Custom error classes
 */
export class RateLimitError extends Error {
  waitTime: number;

  constructor(message: string, waitTime: number) {
    super(message);
    this.name = 'RateLimitError';
    this.waitTime = waitTime;
  }
}

export class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface RequestOptions extends RequestInit {
  skipCache?: boolean;
  cacheTime?: number; // milliseconds
}

class ApiClient {
  private readonly BASE_URL = API_CONFIG.BASE_URL;
  private deviceId: string | null = null;
  private readonly CACHE_PREFIX = '@bookmate_api_cache_';

  /**
   * Initialize API client
   */
  async initialize(): Promise<void> {
    this.deviceId = await this.getDeviceId();
  }

  /**
   * Make authenticated API request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // Ensure device ID is loaded
    if (!this.deviceId) {
      await this.initialize();
    }

    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      if (!options.skipCache) {
        const cached = await this.getFromCache(endpoint);
        if (cached) {
          return cached as T;
        }
      }
    }

    // Get JWT token for authentication
    const token = await getToken();

    // Prepare headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Platform': Platform.OS,
      'X-Client-Version': '1.0.2',
      'X-Device-ID': this.deviceId || 'unknown',
      'X-Request-ID': this.generateRequestId(),
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle session expiration (401)
      if (response.status === 401) {
        // Clear session and throw specific error
        await clearSession();
        throw new ApiError(
          'Session expired. Please login again.',
          'SESSION_EXPIRED',
          401
        );
      }

      // Handle rate limiting (429)
      if (response.status === 429) {
        const data = await response.json();
        const resetAt = new Date(data.details?.resetAt || Date.now() + 60000);
        const waitTime = resetAt.getTime() - Date.now();

        throw new RateLimitError(
          `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds`,
          waitTime
        );
      }

      // Handle other errors
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(
          error.error || 'Request failed',
          error.code || 'UNKNOWN_ERROR',
          response.status
        );
      }

      const data = await response.json();

      // Cache successful GET requests
      if (options.method === 'GET' || !options.method) {
        await this.saveToCache(endpoint, data, options.cacheTime);
      }

      return data as T;
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed',
        'NETWORK_ERROR',
        0
      );
    }
  }

  /**
   * GET request with caching
   */
  async get<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // ============================================================
  // Convenience methods for BookMate API endpoints
  // ============================================================

  /**
   * Get balance data (cached for 5 minutes)
   */
  async getBalance(): Promise<any> {
    return this.get('/balance', {
      cacheTime: 5 * 60 * 1000, // 5 minutes
    });
  }

  /**
   * Get P&L data (cached for 5 minutes)
   */
  async getPnL(): Promise<any> {
    return this.get('/pnl', {
      cacheTime: 5 * 60 * 1000, // 5 minutes
    });
  }

  /**
   * Get options/categories (cached for 10 minutes)
   */
  async getOptions(): Promise<any> {
    return this.get('/options', {
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });
  }

  /**
   * Get transactions (cached for 2 minutes)
   */
  async getTransactions(): Promise<any> {
    return this.get('/transactions', {
      cacheTime: 2 * 60 * 1000, // 2 minutes
    });
  }

  /**
   * Post Google Sheets data (no cache)
   */
  async postSheets(data: any): Promise<any> {
    return this.post('/sheets', data);
  }

  /**
   * Upload for OCR (no cache)
   */
  async uploadOCR(data: any): Promise<any> {
    return this.post('/extract/ocr', data);
  }

  /**
   * Generate report (no cache)
   */
  async generateReport(data: any): Promise<any> {
    return this.post('/reports/generate', data);
  }

  /**
   * Get AI insights (cached for 1 hour)
   */
  async getAIInsights(data: any): Promise<any> {
    return this.post('/reports/ai-insights', data, {
      cacheTime: 60 * 60 * 1000, // 1 hour
    });
  }

  // ============================================================
  // Cache management
  // ============================================================

  /**
   * Get data from cache
   */
  private async getFromCache(endpoint: string): Promise<any | null> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${endpoint}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        const entry: CacheEntry = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (default 5 minutes)
        const maxAge = 5 * 60 * 1000; // 5 minutes
        if (now - entry.timestamp < maxAge) {
          console.log(`Cache hit for ${endpoint}`);
          return entry.data;
        }

        // Cache expired
        await AsyncStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }

    return null;
  }

  /**
   * Save data to cache
   */
  private async saveToCache(
    endpoint: string,
    data: any,
    cacheTime?: number
  ): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${endpoint}`;
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
      console.log(`Cached data for ${endpoint}`);
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`Cleared ${cacheKeys.length} cache entries`);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Clear specific endpoint cache
   */
  async clearEndpointCache(endpoint: string): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}${endpoint}`;
      await AsyncStorage.removeItem(cacheKey);
      console.log(`Cleared cache for ${endpoint}`);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // ============================================================
  // Utility methods
  // ============================================================

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
   * Generate UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate request ID for tracing
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle rate limit error with retry
   */
  async handleRateLimitError(error: RateLimitError, retryFn: () => Promise<any>): Promise<any> {
    console.log(`Rate limited. Waiting ${Math.ceil(error.waitTime / 1000)}s...`);

    // Wait for rate limit to reset
    await new Promise((resolve) => setTimeout(resolve, error.waitTime));

    // Retry the request
    return retryFn();
  }
}

// Export singleton instance
export default new ApiClient();
