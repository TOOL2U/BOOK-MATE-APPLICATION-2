#!/usr/bin/env node

/**
 * API Connection Test Script
 * 
 * This script tests all critical API endpoints to verify they're accessible
 * Run: node test-api-connection.js
 */

const https = require('https');

const API_BASE = 'https://accounting.siamoon.com';

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(path, API_BASE);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const success = status >= 200 && status < 300;
        
        let parsedData = null;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          // Not JSON
        }

        resolve({
          path,
          method,
          status,
          success,
          duration,
          data: parsedData,
          rawData: data.substring(0, 200), // First 200 chars
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        path,
        method,
        status: 0,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        path,
        method,
        status: 0,
        success: false,
        duration: Date.now() - startTime,
        error: 'Request timeout (10s)',
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  BookMate API Connection Test${colors.reset}`);
  console.log(`${colors.blue}  Base URL: ${API_BASE}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  const endpoints = [
    '/api/options',
    '/api/balance',
    '/api/balance?month=ALL',
    '/api/pnl',
    '/api/pnl?month=ALL',
    '/api/transactions',
    '/api/ledger',
  ];

  const results = [];

  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);

    const statusColor = result.success ? colors.green : colors.red;
    const statusIcon = result.success ? '✓' : '✗';
    
    console.log(
      `${statusColor}${statusIcon} ${result.status || 'ERR'}${colors.reset} ` +
      `${colors.yellow}(${result.duration}ms)${colors.reset}`
    );

    if (!result.success && result.error) {
      console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
    }

    // Wait 100ms between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Test Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + r.duration, 0) / results.length
  );

  console.log(`Total Tests: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Average Response Time: ${avgDuration}ms\n`);

  // Show data sample from /api/options
  const optionsResult = results.find(r => r.path === '/api/options');
  if (optionsResult && optionsResult.data) {
    console.log(`${colors.blue}Sample Data (from /api/options):${colors.reset}`);
    console.log(`  Properties: ${optionsResult.data.data?.properties?.length || 0}`);
    console.log(`  Operations: ${optionsResult.data.data?.typeOfOperation?.length || 0}`);
    console.log(`  Payments: ${optionsResult.data.data?.typeOfPayments?.length || 0}`);
    console.log(`  Cached: ${optionsResult.data.cached}`);
    console.log(`  Source: ${optionsResult.data.source}\n`);
  }

  // Recommendations
  console.log(`${colors.blue}Recommendations:${colors.reset}`);
  if (failed === 0) {
    console.log(`  ${colors.green}✓ All endpoints are accessible${colors.reset}`);
    console.log(`  ${colors.green}✓ API is working correctly${colors.reset}`);
    console.log(`  ${colors.green}✓ Ready for offline testing${colors.reset}\n`);
  } else {
    console.log(`  ${colors.red}✗ Some endpoints are failing${colors.reset}`);
    console.log(`  ${colors.yellow}⚠ Check network connection${colors.reset}`);
    console.log(`  ${colors.yellow}⚠ Verify API server is running${colors.reset}\n`);
  }

  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
