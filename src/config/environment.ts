/**
 * Environment Configuration
 * Centralizes all environment-specific settings
 */

const isDev = __DEV__;

export const ENV = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com/api',
  AUTH_SECRET: process.env.EXPO_PUBLIC_AUTH_SECRET || '',
  
  // App Configuration
  APP_NAME: 'BookMate',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  
  // Feature Flags
  ENABLE_OFFLINE_MODE: true,
  ENABLE_DEBUG_LOGGING: isDev,
  ENABLE_CRASH_REPORTING: !isDev, // Enable in production
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Environment
  IS_DEV: isDev,
  IS_PRODUCTION: !isDev,
};

export default ENV;
