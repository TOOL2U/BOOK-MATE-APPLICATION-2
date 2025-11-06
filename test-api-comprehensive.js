// Node.js requires for testing (not ES modules)
const { BASE_URL, REQUEST_TIMEOUT_MS, RETRIES } = require('./src/config/env.ts');

// Simple fetch implementation for testing
async function getJson(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    timeout: REQUEST_TIMEOUT_MS,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function postJson(endpoint, payload) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    timeout: REQUEST_TIMEOUT_MS,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Simple API service for testing
const apiService = {
  getOptions: () => getJson("/api/options"),
  getBalance: (month = 'ALL') => getJson(`/api/balance?month=${month}`),
  getPnL: (month = 'ALL') => getJson(`/api/pnl?month=${month}`),
  getTransactions: (month) => getJson(`/api/transactions${month ? `?month=${month}` : ""}`),
  getLedger: (month = 'ALL') => getJson(`/api/ledger?month=${month}`),
  postSheets: (payload) => postJson("/api/sheets", payload),
  getHealth: () => getJson("/api/admin/health"),
};

async function testAllEndpoints() {
  console.log('🚀 Starting comprehensive API test...\n');

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const result = await apiService.getHealth();
        return { result, success: result.ok === true };
      }
    },
    {
      name: 'Get Options',
      test: async () => {
        const result = await apiService.getOptions();
        return { 
          result, 
          success: result.data && Array.isArray(result.data.properties) 
        };
      }
    },
    {
      name: 'Get Balance (ALL)',
      test: async () => {
        const result = await apiService.getBalance('ALL');
        return { 
          result, 
          success: result.data && Array.isArray(result.data.rows) 
        };
      }
    },
    {
      name: 'Get Balance (JAN)',
      test: async () => {
        const result = await apiService.getBalance('JAN');
        return { 
          result, 
          success: result.data && Array.isArray(result.data.rows) 
        };
      }
    },
    {
      name: 'Get P&L (ALL)',
      test: async () => {
        const result = await apiService.getPnL('ALL');
        return { 
          result, 
          success: result.data && (result.data.revenue || result.data.overhead) 
        };
      }
    },
    {
      name: 'Get P&L (JAN)',
      test: async () => {
        const result = await apiService.getPnL('JAN');
        return { 
          result, 
          success: result.data && (result.data.revenue || result.data.overhead) 
        };
      }
    },
    {
      name: 'Get Transactions',
      test: async () => {
        const result = await apiService.getTransactions();
        return { 
          result, 
          success: result.data && Array.isArray(result.data) 
        };
      }
    },
    {
      name: 'Get Transactions (JAN)',
      test: async () => {
        const result = await apiService.getTransactions('JAN');
        return { 
          result, 
          success: result.data && Array.isArray(result.data) 
        };
      }
    },
    {
      name: 'Get Ledger',
      test: async () => {
        const result = await apiService.getLedger();
        return { 
          result, 
          success: result.data && Array.isArray(result.data) 
        };
      }
    },
    {
      name: 'Get Ledger (JAN)',
      test: async () => {
        const result = await apiService.getLedger('JAN');
        return { 
          result, 
          success: result.data && Array.isArray(result.data) 
        };
      }
    },
  ];

  const results = [];

  for (const { name, test } of tests) {
    try {
      console.log(`🧪 Testing: ${name}`);
      const { result, success } = await test();
      
      console.log(`${success ? '✅' : '❌'} ${name}: ${success ? 'PASS' : 'FAIL'}`);
      
      if (!success) {
        console.log('   📝 Response:', JSON.stringify(result, null, 2));
      }
      
      results.push({ name, success, result });
      
      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`❌ ${name}: ERROR`);
      console.log(`   🚨 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.push({ name, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Test offline queue status
  console.log('\n📦 Offline Queue: Not tested (requires React Native environment)');

  // Summary
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Test Summary: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! API reconnection successful.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }

  return results;
}

// Run tests if called directly
if (require.main === module) {
  testAllEndpoints()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}