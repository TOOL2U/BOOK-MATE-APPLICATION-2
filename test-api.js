#!/usr/bin/env node

/**
 * API Connectivity Test Script
 * Tests all Accounting Buddy API endpoints
 */

const https = require('https');

const BASE_URL = 'accounting-buddy-app.vercel.app';
const API_PATH = '/api';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `${API_PATH}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testEndpoint(name, path, method = 'GET', data = null) {
  try {
    log(`\nTesting: ${name}`, 'cyan');
    log(`  ${method} ${API_PATH}${path}`, 'blue');

    const result = await makeRequest(path, method, data);

    if (result.status === 200) {
      log(`  ✓ Status: ${result.status}`, 'green');
      log(`  Response: ${JSON.stringify(result.data).substring(0, 100)}...`, 'reset');
      return true;
    } else {
      log(`  ✗ Status: ${result.status}`, 'yellow');
      log(`  Response: ${JSON.stringify(result.data)}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`  ✗ Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════', 'cyan');
  log('  Accounting Buddy API Connectivity Test', 'cyan');
  log('═══════════════════════════════════════════════', 'cyan');
  log(`\nBase URL: https://${BASE_URL}${API_PATH}`, 'blue');

  const results = [];

  // Test 1: Health Check
  results.push(await testEndpoint('Health Check', '/sheets', 'GET'));

  // Test 2: P&L Endpoint
  results.push(await testEndpoint('P&L Dashboard', '/pnl', 'GET'));

  // Test 3: Balance Get
  results.push(await testEndpoint('Get Balances', '/balance/get', 'GET'));

  // Test 4: Inbox
  results.push(await testEndpoint('Inbox (Transactions)', '/inbox', 'GET'));

  // Summary
  log('\n═══════════════════════════════════════════════', 'cyan');
  log('  Test Summary', 'cyan');
  log('═══════════════════════════════════════════════', 'cyan');

  const passed = results.filter(Boolean).length;
  const total = results.length;

  log(`\nTotal Tests: ${total}`, 'blue');
  log(`Passed: ${passed}`, passed === total ? 'green' : 'yellow');
  log(`Failed: ${total - passed}`, total - passed === 0 ? 'green' : 'red');

  if (passed === total) {
    log('\n✓ All API endpoints are accessible!', 'green');
  } else {
    log('\n⚠ Some endpoints may need backend configuration', 'yellow');
    log('  This is expected for a fresh setup', 'yellow');
  }

  log('\n═══════════════════════════════════════════════\n', 'cyan');
}

// Run tests
runTests().catch((error) => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});

