// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://accounting.siamoon.com/api',
  AUTH_SECRET: process.env.AUTH_SECRET || '',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  OCR: '/ocr',
  EXTRACT: '/extract',
  SHEETS: '/sheets',
  INBOX: '/inbox',
  PNL: '/pnl',
  PNL_PROPERTY: '/pnl/property-person',
  PNL_OVERHEAD: '/pnl/overhead-expenses',
  BALANCE_GET: '/balance/get',
  BALANCE_SAVE: '/balance/save',
  BALANCE_OCR: '/balance/ocr',
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  INBOX: 5000,      // 5 seconds
  PNL: 60000,       // 60 seconds
  BALANCE: 30000,   // 30 seconds
} as const;

