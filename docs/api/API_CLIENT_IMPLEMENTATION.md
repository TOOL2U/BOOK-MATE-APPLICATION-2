# API Client & Health Service Implementation

**Version**: 1.0.2  
**Date**: November 11, 2025  
**Status**: ✅ Implemented  
**Based on**: Webapp Team Recommendations (MOBILE_INTEGRATION_CONFIRMATION.md)

---

## 📦 Files Created

### Core Services
- ✅ `src/services/HealthService.ts` - Health check polling service
- ✅ `src/services/ApiClient.ts` - Enhanced API client with rate limiting
- ✅ `src/hooks/useHealthStatus.ts` - React hook for health status
- ✅ `src/hooks/useApiClient.ts` - React hook for API requests

---

## 🚀 Features Implemented

### 1. Health Check Polling
- ✅ Polls `/api/health/balance` every 30 seconds
- ✅ Rate limit: 200 requests/min (highest tier)
- ✅ Automatic start/stop on component mount/unmount
- ✅ Caches last known health status
- ✅ Includes platform, version, device ID headers

### 2. API Client with Rate Limiting
- ✅ Automatic 429 error handling with retry
- ✅ Client-side caching (configurable TTL)
- ✅ Request headers: X-Platform, X-Client-Version, X-Device-ID, X-Request-ID
- ✅ Error handling with user-friendly messages
- ✅ Convenience methods for all BookMate endpoints

### 3. Caching Strategy
- ✅ Balance: 5 minutes cache
- ✅ P&L: 5 minutes cache
- ✅ Options/Categories: 10 minutes cache
- ✅ Transactions: 2 minutes cache
- ✅ AI Insights: 1 hour cache
- ✅ Manual cache clearing available

### 4. Error Handling
- ✅ Rate limit errors (429)
- ✅ API errors (400, 401, 403, 404, 500)
- ✅ Network errors
- ✅ User-friendly error messages
- ✅ Alert dialogs with retry options

---

## 📖 Usage Examples

### Health Status in Components

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHealthStatus } from '../hooks/useHealthStatus';

const DashboardScreen = () => {
  const { 
    isHealthy, 
    lastSync, 
    accountCount, 
    isPolling 
  } = useHealthStatus(); // Auto-starts polling

  return (
    <View style={styles.container}>
      <View style={styles.statusBadge}>
        <View style={[
          styles.indicator,
          { backgroundColor: isHealthy ? '#10b981' : '#ef4444' }
        ]} />
        <Text style={styles.statusText}>
          {isHealthy ? 'Synced' : 'Offline'}
        </Text>
      </View>

      {lastSync && (
        <Text style={styles.syncTime}>
          Last sync: {new Date(lastSync).toLocaleTimeString()}
        </Text>
      )}

      {accountCount && (
        <Text style={styles.accountCount}>
          {accountCount} accounts synced
        </Text>
      )}

      {isPolling && (
        <Text style={styles.pollingIndicator}>
          🔄 Checking sync status...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  syncTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  accountCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  pollingIndicator: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 8,
  },
});

export default DashboardScreen;
```

### Using API Client with React Hook

```tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { useApiClient } from '../hooks/useApiClient';
import ApiClient from '../services/ApiClient';

const BalanceScreen = () => {
  const { data, loading, error, execute } = useApiClient();

  const loadBalance = () => {
    execute(() => ApiClient.getBalance());
  };

  useEffect(() => {
    loadBalance();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading balance...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
        <Button title="Retry" onPress={loadBalance} />
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Balance: {data?.total || 0} THB
      </Text>
      <Button title="Refresh" onPress={loadBalance} />
    </View>
  );
};

export default BalanceScreen;
```

### Using API Client Directly

```tsx
import ApiClient from '../services/ApiClient';

// Initialize once when app starts
await ApiClient.initialize();

// Get balance (cached for 5 minutes)
const balance = await ApiClient.getBalance();

// Get P&L (cached for 5 minutes)
const pnl = await ApiClient.getPnL();

// Get options (cached for 10 minutes)
const options = await ApiClient.getOptions();

// Post sheets data (no cache)
const result = await ApiClient.postSheets({
  transactions: [...],
});

// Generate report (no cache)
const report = await ApiClient.generateReport({
  startDate: '2025-11-01',
  endDate: '2025-11-30',
});

// Get AI insights (cached for 1 hour)
const insights = await ApiClient.getAIInsights({
  period: {
    type: 'monthly',
    start: '2025-11-01',
    end: '2025-11-30',
  },
  metrics: {
    totalRevenue: 150000,
    totalExpenses: 85000,
  },
});

// Clear cache
await ApiClient.clearCache();

// Clear specific endpoint cache
await ApiClient.clearEndpointCache('/balance');
```

### Rate Limit Handling

```tsx
import ApiClient, { RateLimitError } from '../services/ApiClient';

try {
  const balance = await ApiClient.getBalance();
  console.log(balance);
} catch (error) {
  if (error instanceof RateLimitError) {
    // Automatically handled by useApiClient hook
    // Or handle manually:
    const result = await ApiClient.handleRateLimitError(
      error,
      () => ApiClient.getBalance()
    );
    console.log(result);
  }
}
```

### Manual Health Check Control

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useHealthStatus } from '../hooks/useHealthStatus';

const SettingsScreen = () => {
  const { 
    isHealthy, 
    isPolling, 
    startPolling, 
    stopPolling 
  } = useHealthStatus(false); // Don't auto-start

  return (
    <View style={{ padding: 16 }}>
      <Text>Status: {isHealthy ? 'Healthy' : 'Unhealthy'}</Text>
      <Text>Polling: {isPolling ? 'Active' : 'Inactive'}</Text>
      
      <Button 
        title={isPolling ? 'Stop Polling' : 'Start Polling'}
        onPress={isPolling ? stopPolling : startPolling}
      />
    </View>
  );
};

export default SettingsScreen;
```

---

## 🔧 Configuration

### Caching Times (Configurable)

Edit `src/services/ApiClient.ts` to adjust cache times:

```typescript
// Balance cache: 5 minutes (default)
async getBalance(): Promise<any> {
  return this.get('/balance', {
    cacheTime: 5 * 60 * 1000, // Change here
  });
}

// P&L cache: 5 minutes (default)
async getPnL(): Promise<any> {
  return this.get('/pnl', {
    cacheTime: 5 * 60 * 1000, // Change here
  });
}

// Options cache: 10 minutes (default)
async getOptions(): Promise<any> {
  return this.get('/options', {
    cacheTime: 10 * 60 * 1000, // Change here
  });
}
```

### Health Polling Interval

Edit `src/services/HealthService.ts`:

```typescript
class HealthService {
  private readonly POLL_INTERVAL = 30000; // 30 seconds (default)
  // Change to:
  // private readonly POLL_INTERVAL = 60000; // 60 seconds
}
```

---

## 📊 Rate Limits Reference

| Endpoint | Rate Limit | Cache Time | Mobile Usage | Headroom |
|----------|------------|------------|--------------|----------|
| `/api/health/balance` | 200/min | None | 2/min | 100x |
| `/api/balance` | 100/min | 5 min | 5-10/min | 10x |
| `/api/pnl` | 100/min | 5 min | 5-10/min | 10x |
| `/api/options` | 100/min | 10 min | 4/min | 25x |
| `/api/transactions` | 100/min | 2 min | 5/min | 20x |
| `/api/sheets` | 30/min | None | 1-5/min | 6x |
| `/api/reports/generate` | 10/min | None | 1-2/min | 5x |
| `/api/reports/ai-insights` | 10/min | 1 hour | 1/min | 10x |

**Verdict**: All mobile usage well within limits with 5-100x headroom. ✅

---

## 🧪 Testing

### Test Health Service

```tsx
import HealthService from '../services/HealthService';

// Start polling
HealthService.startHealthPolling((status) => {
  console.log('Health status:', status);
  // {
  //   isHealthy: true,
  //   lastSync: '2025-11-11T10:30:00Z',
  //   accountCount: 25,
  //   timestamp: Date
  // }
});

// Check if polling
console.log(HealthService.isActivelyPolling()); // true

// Get cached status
const cached = await HealthService.getCachedHealthStatus();
console.log(cached);

// Stop polling
HealthService.stopHealthPolling();
```

### Test API Client

```tsx
import ApiClient from '../services/ApiClient';

// Initialize
await ApiClient.initialize();

// Test balance endpoint
const balance = await ApiClient.getBalance();
console.log('Balance:', balance);

// Test with error handling
try {
  const pnl = await ApiClient.getPnL();
  console.log('P&L:', pnl);
} catch (error) {
  console.error('Error:', error);
}

// Test cache
await ApiClient.clearCache();
console.log('Cache cleared');
```

---

## ✅ Implementation Checklist

### Phase 1: Core Services ✅
- [x] Create HealthService.ts
- [x] Create ApiClient.ts
- [x] Add TypeScript types
- [x] Add error handling
- [x] Add caching logic

### Phase 2: React Hooks ✅
- [x] Create useHealthStatus hook
- [x] Create useApiClient hook
- [x] Add automatic lifecycle management
- [x] Add error state management

### Phase 3: Integration (Next Steps)
- [ ] Update existing screens to use new services
- [ ] Replace old api.ts calls with ApiClient
- [ ] Add health status indicator to dashboard
- [ ] Test rate limit handling
- [ ] Test cache performance

### Phase 4: Testing (Next Steps)
- [ ] Test health polling in background
- [ ] Test rate limit scenarios
- [ ] Test network error recovery
- [ ] Test cache invalidation
- [ ] Test on iOS and Android

---

## 🚀 Migration Guide

### Migrating from Old API Service

**Before** (old api.ts):
```tsx
import { getBalance } from '../services/api';

const balance = await getBalance();
```

**After** (new ApiClient.ts):
```tsx
import ApiClient from '../services/ApiClient';

await ApiClient.initialize(); // Once at app start
const balance = await ApiClient.getBalance(); // Cached automatically
```

### Using with React Hooks

**Before**:
```tsx
const [balance, setBalance] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  getBalance()
    .then(setBalance)
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);
```

**After**:
```tsx
const { data: balance, loading } = useApiClient();

useEffect(() => {
  execute(() => ApiClient.getBalance());
}, []);
```

---

## 📝 Next Steps

1. **Integration Testing**:
   - Test health polling across app lifecycle
   - Verify cache performance
   - Test rate limit handling

2. **UI Updates**:
   - Add health status indicator to dashboard
   - Add sync timestamp display
   - Add manual refresh buttons

3. **Performance Monitoring**:
   - Monitor API response times
   - Track cache hit rates
   - Monitor rate limit usage

4. **Documentation**:
   - Update README with new services
   - Add troubleshooting guide
   - Document cache strategy

---

**Status**: ✅ Ready for integration and testing  
**Next**: Update existing screens to use new services  
**Timeline**: Complete integration before production build (Nov 12)

---

**Implemented by**: Mobile Team  
**Based on**: Webapp Team Recommendations  
**Date**: November 11, 2025
