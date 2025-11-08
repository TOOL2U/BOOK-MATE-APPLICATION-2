// =========================================
// BACKEND SPEC v9.0: Transfer Test
// =========================================
// Schema Update: Transfer moved to Data!F2
// Required fields: timestamp, fromAccount, toAccount, transactionType, 
//                  typeOfOperation, amount, ref
// Backend handles dual-entry generation automatically
// Does NOT affect P&L calculations
// Must appear in Transactions tab and sync to ledger

const apiBaseUrl = 'https://accounting.siamoon.com';
const API_URL = `${apiBaseUrl}/api/sheets`;

// Helper function to convert month number to abbreviation
const getMonthAbbreviation = (monthNumber) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || 'Jan';
};

async function testTransfer() {
  console.log('\n🧪 Testing Transfer Feature (Backend v9.0 Spec)\n');

  const today = new Date();
  const timestamp = new Date().toISOString();
  const refId = `T-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
  const fromAccount = 'Cash - Family';
  const toAccount = 'Bank Transfer - Bangkok Bank - Shaun Ducker';
  const amount = 50000; // Using PM's example amount

  console.log('📋 Transfer Details:');
  console.log(`   From: ${fromAccount}`);
  console.log(`   To: ${toAccount}`);
  console.log(`   Amount: ₿${amount.toLocaleString()}`);
  console.log(`   Ref: ${refId}`);
  console.log(`   Timestamp: ${timestamp}\n`);

  // ========================================
  // Backend v9.0 Transfer Structure
  // ========================================
  console.log('📤 Creating Transfer transaction...');
  const transferTransaction = {
    timestamp: timestamp,                    // ISO timestamp (required)
    day: today.getDate().toString(),
    month: getMonthAbbreviation(today.getMonth() + 1),
    year: today.getFullYear().toString(),
    property: 'Family',
    fromAccount: fromAccount,                // Source account (v9.0 required)
    toAccount: toAccount,                    // Destination account (v9.0 required)
    transactionType: 'Transfer',             // Must be "Transfer" (v9.0 required)
    typeOfOperation: 'Transfer',             // Must be "Transfer" (required)
    typeOfPayment: fromAccount,              // Still required by backend (use fromAccount)
    amount: amount,                          // Transfer amount (v9.0 required)
    detail: `Transfer from ${fromAccount} to ${toAccount}`,
    ref: refId,                              // Transaction reference (required)
    debit: 0,                                // Backend calculates dual-entry
    credit: 0,                               // Backend calculates dual-entry
  };

  console.log('Transfer Transaction:', JSON.stringify(transferTransaction, null, 2));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transferTransaction),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Transfer FAILED:', result.message || 'Unknown error');
      console.error('Full response:', JSON.stringify(result, null, 2));
      return;
    }
    
    console.log('✅ Transfer created successfully');
    console.log('Response:', JSON.stringify(result, null, 2));
    console.log('\n🎉 TRANSFER COMPLETE!');
    console.log('\n📊 Expected Results:');
    console.log('   ✓ Transaction appears in Transactions tab');
    console.log('   ✓ Located in Data!F2 (not Revenues or Expenses)');
    console.log('   ✓ Backend generates dual-entry structure for ledger');
    console.log('   ✓ NOT included in P&L totals');
    console.log('   ✓ Syncs cleanly to ledger');
    console.log(`   ✓ ${fromAccount} balance decreased by ₿${amount.toLocaleString()}`);
    console.log(`   ✓ ${toAccount} balance increased by ₿${amount.toLocaleString()}\n`);
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testTransfer();