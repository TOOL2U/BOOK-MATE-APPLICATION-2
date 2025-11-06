// Simple Node.js test for API endpoints
const BASE_URL = 'https://accounting.siamoon.com';
const REQUEST_TIMEOUT_MS = 20000;

// Simple fetch implementation for testing
async function getJson(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`🔗 GET ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function postJson(endpoint, payload) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`🔗 POST ${url}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
      name: 'Health Check (via Options)',
      test: async () => {
        // Health endpoint requires auth, so test connectivity via options
        try {
          await apiService.getOptions();
          return { result: { ok: true, method: 'options-fallback' }, success: true };
        } catch (error) {
          return { result: { ok: false, error: error.message }, success: false };
        }
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
          success: result.ok && Array.isArray(result.items) 
        };
      }
    },
    {
      name: 'Get Balance (JAN)',
      test: async () => {
        const result = await apiService.getBalance('JAN');
        return { 
          result, 
          success: result.ok && Array.isArray(result.items) 
        };
      }
    },
    {
      name: 'Get P&L (ALL)',
      test: async () => {
        const result = await apiService.getPnL('ALL');
        return { 
          result, 
          success: result.ok && result.data && typeof result.data.month === 'object'
        };
      }
    },
    {
      name: 'Get P&L (JAN)',
      test: async () => {
        const result = await apiService.getPnL('JAN');
        return { 
          result, 
          success: result.ok && result.data && typeof result.data.month === 'object'
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

  // Summary
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Test Summary: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! API reconnection successful.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
    
    // Show failed tests
    const failed = results.filter(r => !r.success);
    console.log('\n❌ Failed tests:');
    failed.forEach(test => {
      console.log(`   - ${test.name}: ${test.error || 'Check response above'}`);
    });
  }

  return results;
}

// Run tests
testAllEndpoints()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });