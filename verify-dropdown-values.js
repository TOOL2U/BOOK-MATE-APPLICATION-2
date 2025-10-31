#!/usr/bin/env node

/**
 * Verification Script for Dropdown Values
 * 
 * This script verifies that all dropdown values in src/types/index.ts
 * match the expected counts and formats from the API integration guide.
 * 
 * Run: node verify-dropdown-values.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Dropdown Values...\n');

// Read the types file
const typesPath = path.join(__dirname, 'src', 'types', 'index.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');

// Extract the constants
const propertiesMatch = typesContent.match(/export const PROPERTIES = \[([\s\S]*?)\] as const;/);
const operationsMatch = typesContent.match(/export const TYPE_OF_OPERATIONS = \[([\s\S]*?)\] as const;/);
const paymentsMatch = typesContent.match(/export const TYPE_OF_PAYMENTS = \[([\s\S]*?)\] as const;/);

if (!propertiesMatch || !operationsMatch || !paymentsMatch) {
  console.error('❌ ERROR: Could not parse constants from types file');
  process.exit(1);
}

// Parse the values (extract strings between quotes)
const parseValues = (text) => {
  const matches = text.match(/'([^']+)'/g);
  return matches ? matches.map(m => m.slice(1, -1)) : [];
};

const properties = parseValues(propertiesMatch[1]);
const operations = parseValues(operationsMatch[1]);
const payments = parseValues(paymentsMatch[1]);

// Expected counts
const EXPECTED_PROPERTIES = 7;
const EXPECTED_OPERATIONS = 33;
const EXPECTED_PAYMENTS = 4;

// Verification results
let allPassed = true;

// Check Properties
console.log('📋 PROPERTIES:');
console.log(`   Expected: ${EXPECTED_PROPERTIES}`);
console.log(`   Found: ${properties.length}`);
if (properties.length === EXPECTED_PROPERTIES) {
  console.log('   ✅ PASS\n');
} else {
  console.log('   ❌ FAIL - Count mismatch!\n');
  allPassed = false;
}

// Check Type of Operations
console.log('📋 TYPE OF OPERATIONS:');
console.log(`   Expected: ${EXPECTED_OPERATIONS}`);
console.log(`   Found: ${operations.length}`);
if (operations.length === EXPECTED_OPERATIONS) {
  console.log('   ✅ PASS\n');
} else {
  console.log('   ❌ FAIL - Count mismatch!\n');
  allPassed = false;
}

// Check Type of Payments
console.log('📋 TYPE OF PAYMENTS:');
console.log(`   Expected: ${EXPECTED_PAYMENTS}`);
console.log(`   Found: ${payments.length}`);
if (payments.length === EXPECTED_PAYMENTS) {
  console.log('   ✅ PASS\n');
} else {
  console.log('   ❌ FAIL - Count mismatch!\n');
  allPassed = false;
}

// Check for specific critical values
console.log('🔍 CRITICAL VALUE CHECKS:\n');

const criticalChecks = [
  {
    name: 'Misspelled "Commision"',
    value: 'Revenue - Commision',
    array: operations,
    description: 'Must use misspelled version (not "Commission")'
  },
  {
    name: 'Double space in Electricity',
    value: 'EXP - Utilities  - Electricity',
    array: operations,
    description: 'Must have TWO spaces before "Electricity"'
  },
  {
    name: 'Double space in Subscription',
    value: 'EXP - Administration & General  - Subscription, Software & Membership',
    array: operations,
    description: 'Must have TWO spaces before "Subscription"'
  },
  {
    name: 'Double space in Furniture',
    value: 'EXP - Repairs & Maintenance  - Furniture & Decorative Items',
    array: operations,
    description: 'Must have TWO spaces before "Furniture"'
  },
  {
    name: 'Double space in Marketing',
    value: 'EXP - Sales & Marketing -  Professional Marketing Services',
    array: operations,
    description: 'Must have TWO spaces after dash'
  },
  {
    name: 'Lowercase "transfer" in Krung Thai',
    value: 'Bank transfer - Krung Thai Bank - Family Account',
    array: payments,
    description: 'Must use lowercase "transfer" (not "Transfer")'
  },
  {
    name: 'Capital "Transfer" in Bangkok Bank',
    value: 'Bank Transfer - Bangkok Bank - Shaun Ducker',
    array: payments,
    description: 'Must use capital "Transfer"'
  }
];

criticalChecks.forEach(check => {
  const found = check.array.includes(check.value);
  if (found) {
    console.log(`   ✅ ${check.name}`);
    console.log(`      "${check.value}"`);
  } else {
    console.log(`   ❌ ${check.name}`);
    console.log(`      Expected: "${check.value}"`);
    console.log(`      ${check.description}`);
    allPassed = false;
  }
  console.log('');
});

// Check for incorrect values that should NOT exist
console.log('🚫 CHECKING FOR INCORRECT VALUES:\n');

const incorrectValues = [
  'REV - Rental Income',
  'REV - Service Income',
  'FC - Salaries',
  'FC - Rent',
  'OH - Accounting & Legal',
  'OH - Utilities - Electricity',
  'Revenue - Commission',  // Corrected spelling (wrong)
  'Bank transfer',  // Too generic
  'Card',
  'Other'
];

let foundIncorrect = false;
incorrectValues.forEach(value => {
  const foundInOps = operations.includes(value);
  const foundInPayments = payments.includes(value);
  if (foundInOps || foundInPayments) {
    console.log(`   ❌ FOUND INCORRECT VALUE: "${value}"`);
    foundIncorrect = true;
    allPassed = false;
  }
});

if (!foundIncorrect) {
  console.log('   ✅ No incorrect values found\n');
} else {
  console.log('');
}

// Final summary
console.log('═══════════════════════════════════════════════════════\n');
if (allPassed) {
  console.log('✅ ALL CHECKS PASSED!\n');
  console.log('Dropdown values are correct and ready for use.\n');
  process.exit(0);
} else {
  console.log('❌ VERIFICATION FAILED!\n');
  console.log('Please review the errors above and correct the values.\n');
  process.exit(1);
}

