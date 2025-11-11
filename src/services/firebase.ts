// Firebase Service for BookMate iOS
// Handles Analytics and Crashlytics in production
// NOTE: Firebase packages not installed yet - uncomment imports when ready to enable
// To enable: npm install @react-native-firebase/app @react-native-firebase/analytics @react-native-firebase/crashlytics

// import analytics from '@react-native-firebase/analytics';
// import crashlytics from '@react-native-firebase/crashlytics';

// Stub implementations for when Firebase is not installed
const analytics = () => ({
  setAnalyticsCollectionEnabled: async (_enabled: boolean) => {},
  logEvent: async (_eventName: string, _params?: any) => {},
  logScreenView: async (_params: any) => {},
  setUserId: async (_userId: string) => {},
  setUserProperty: async (_name: string, _value: string) => {},
});

const crashlytics = () => ({
  setCrashlyticsCollectionEnabled: async (_enabled: boolean) => {},
  setUserId: async (_userId: string) => {},
  log: (_message: string) => {},
  recordError: (_error: Error) => {},
  setAttribute: (_key: string, _value: string) => {},
  setAttributes: (_attributes: Record<string, string>) => {},
  crash: () => {},
});

class FirebaseService {
  private isInitialized: boolean = false;

  /**
   * Initialize Firebase (called on app startup)
   */
  async initialize() {
    if (__DEV__) {
      console.log('[Firebase] Running in development mode - analytics disabled');
      return;
    }

    try {
      // Enable analytics collection
      await analytics().setAnalyticsCollectionEnabled(true);
      
      // Enable crashlytics collection
      await crashlytics().setCrashlyticsCollectionEnabled(true);
      
      this.isInitialized = true;
      console.log('[Firebase] Initialized successfully');
    } catch (error) {
      console.error('[Firebase] Initialization error:', error);
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Log a custom event
   * @param eventName - Name of the event (use snake_case)
   * @param params - Optional parameters object
   */
  async logEvent(eventName: string, params?: Record<string, any>) {
    if (__DEV__) {
      console.log('[Firebase Analytics]', eventName, params);
      return;
    }

    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('[Firebase] logEvent error:', error);
    }
  }

  /**
   * Log screen view
   * @param screenName - Name of the screen
   * @param screenClass - Class/component name
   */
  async logScreenView(screenName: string, screenClass: string) {
    if (__DEV__) {
      console.log('[Firebase] Screen view:', screenName);
      return;
    }

    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass,
      });
    } catch (error) {
      console.error('[Firebase] logScreenView error:', error);
    }
  }

  /**
   * Set user ID
   * @param userId - Unique user identifier
   */
  async setUserId(userId: string) {
    if (__DEV__) return;

    try {
      await analytics().setUserId(userId);
      await crashlytics().setUserId(userId);
    } catch (error) {
      console.error('[Firebase] setUserId error:', error);
    }
  }

  /**
   * Set user property
   * @param name - Property name
   * @param value - Property value
   */
  async setUserProperty(name: string, value: string) {
    if (__DEV__) return;

    try {
      await analytics().setUserProperty(name, value);
    } catch (error) {
      console.error('[Firebase] setUserProperty error:', error);
    }
  }

  // ==================== CRASHLYTICS ====================

  /**
   * Log an error to Crashlytics
   * @param error - Error object
   * @param context - Optional context string
   */
  logError(error: Error, context?: string) {
    if (__DEV__) {
      console.error('[Firebase Crashlytics]', context || '', error);
      return;
    }

    try {
      if (context) {
        crashlytics().log(context);
      }
      crashlytics().recordError(error);
    } catch (e) {
      console.error('[Firebase] logError error:', e);
    }
  }

  /**
   * Log a non-fatal error with custom message
   * @param message - Error message
   * @param stack - Optional stack trace
   */
  logMessage(message: string, stack?: string) {
    if (__DEV__) {
      console.log('[Firebase Crashlytics]', message);
      return;
    }

    try {
      crashlytics().log(message);
      if (stack) {
        crashlytics().recordError(new Error(message));
      }
    } catch (error) {
      console.error('[Firebase] logMessage error:', error);
    }
  }

  /**
   * Set custom attribute for crash reports
   * @param key - Attribute key
   * @param value - Attribute value
   */
  setCrashlyticsAttribute(key: string, value: string) {
    if (__DEV__) return;

    try {
      crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('[Firebase] setAttribute error:', error);
    }
  }

  /**
   * Set multiple custom attributes
   * @param attributes - Object with key-value pairs
   */
  setCrashlyticsAttributes(attributes: Record<string, string>) {
    if (__DEV__) return;

    try {
      crashlytics().setAttributes(attributes);
    } catch (error) {
      console.error('[Firebase] setAttributes error:', error);
    }
  }

  /**
   * Force a crash (for testing only)
   * USE WITH CAUTION - Only call in development/testing
   */
  async crash() {
    if (__DEV__) {
      console.warn('[Firebase] Crash test called in dev mode - skipping');
      return;
    }
    crashlytics().crash();
  }

  // ==================== COMMON EVENTS ====================

  /**
   * Log app open event
   */
  async logAppOpen() {
    await this.logEvent('app_open', {
      timestamp: new Date().toISOString(),
      version: '1.0.1',
      build: '2',
    });
  }

  /**
   * Log receipt scanned
   * @param method - 'camera' or 'photo_library'
   * @param success - Whether scan was successful
   * @param amount - Extracted amount (if successful)
   */
  async logReceiptScanned(method: 'camera' | 'photo_library', success: boolean, amount?: number) {
    await this.logEvent('receipt_scanned', {
      method,
      success,
      amount: amount || 0,
    });
  }

  /**
   * Log manual entry completed
   * @param category - 'income' or 'expense'
   * @param amount - Transaction amount
   * @param hasProperty - Whether property was selected
   */
  async logManualEntry(category: string, amount: number, hasProperty: boolean) {
    await this.logEvent('manual_entry_completed', {
      category,
      amount,
      has_property: hasProperty,
    });
  }

  /**
   * Log P&L report viewed
   * @param period - 'month' or 'year'
   * @param hasData - Whether report had data
   */
  async logReportViewed(period: 'month' | 'year', hasData: boolean) {
    await this.logEvent('report_viewed', {
      report_type: 'pl',
      period,
      has_data: hasData,
    });
  }

  /**
   * Log transfer completed
   * @param amount - Transfer amount
   * @param fromAccount - Source account name
   * @param toAccount - Destination account name
   */
  async logTransfer(amount: number, fromAccount: string, toAccount: string) {
    await this.logEvent('transfer_completed', {
      amount,
      from_account: fromAccount,
      to_account: toAccount,
    });
  }

  /**
   * Log API error
   * @param endpoint - API endpoint that failed
   * @param statusCode - HTTP status code
   * @param errorMessage - Error message
   */
  async logAPIError(endpoint: string, statusCode: number, errorMessage: string) {
    await this.logEvent('api_error', {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
    });

    // Also log to Crashlytics
    this.logError(
      new Error(`API Error: ${endpoint} - ${statusCode}`),
      `${errorMessage}`
    );
  }
}

export default new FirebaseService();
