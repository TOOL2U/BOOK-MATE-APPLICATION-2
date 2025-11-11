/**
 * Production-Safe Logger
 * Guards debug logs behind __DEV__ flag
 * Keeps error logs for production debugging
 */

import ENV from '../config/environment';

class Logger {
  /**
   * Debug log - only in development
   */
  static debug(...args: any[]) {
    if (ENV.ENABLE_DEBUG_LOGGING) {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Info log - only in development
   */
  static info(...args: any[]) {
    if (ENV.ENABLE_DEBUG_LOGGING) {
      console.log('[INFO]', ...args);
    }
  }

  /**
   * Warning log - always shown
   */
  static warn(...args: any[]) {
    console.warn('[WARN]', ...args);
  }

  /**
   * Error log - always shown
   * TODO: Send to crash reporting service
   */
  static error(...args: any[]) {
    console.error('[ERROR]', ...args);
    
    // TODO: Send to Sentry/Crashlytics in production
    // if (ENV.ENABLE_CRASH_REPORTING) {
    //   Sentry.captureException(new Error(args.join(' ')));
    // }
  }

  /**
   * API request log - only in development
   */
  static request(method: string, url: string, data?: any) {
    if (ENV.ENABLE_DEBUG_LOGGING) {
      console.log(`[API ${method}]`, url, data || '');
    }
  }

  /**
   * API response log - only in development
   */
  static response(method: string, url: string, status: number, data?: any) {
    if (ENV.ENABLE_DEBUG_LOGGING) {
      console.log(`[API ${method} ${status}]`, url, data || '');
    }
  }
}

export default Logger;
