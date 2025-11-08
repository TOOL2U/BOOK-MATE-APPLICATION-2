// =========================================
// BACKEND V9.1: Transfer Test
// =========================================
// Two-row pattern as specified in MOBILE_APP_TRANSFER_UPDATE_V9.1.md
// Row A: Source (debit) - money leaving
// Row B: Destination (credit) - money entering
// Both rows must have matching ref ID

const apiBaseUrl = 'https://accounting.siamoon.com';
const API_URL = `${apiBaseUrl}/api/sheets`;

// Helper function to convert month number to abbreviation
const getMonthAbbreviation = (monthNumber) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || 'Jan';
};

async function testTransfer() {
  console.log('\n🧪 Testing Transfer Feature (Backend V9.1 Spec)\n');

  const today = new Date();
  const refId = `T-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
  const fromAccount = 'Cash - Family';
  const toAccount = 'Bank Transfer - Bangkok Bank - Shaun Ducker';
  const amount = 500; // Using 500 THB as per spec example

  console.log('📋 Transfer Details:');
  console.log(`   From: ${fromAccount}`);
  console.log(`   To: ${toAccount}`);
  console.log(`   Amount: ₿${amount.toLocaleString()}`);
  console.log(`   Ref: ${refId}\n`);

  // ========================================
  // Row A: Source Transaction (DEBIT)
  // ========================================
  console.log('📤 Creating Row A: Source (money leaving)...');
  const sourceTransaction = {
    day: today.getDate().toString(),
    month: getMonthAbbreviation(today.getMonth() + 1),
    year: today.getFullYear().toString(),
    property: '',                                // OPTIONAL for transfers
    typeOfOperation: 'Transfer',                 // From Data!F2
    typeOfPayment: fromAccount,                  // Source account
    detail: `Transfer to ${toAccount}`,          // Must contain "Transfer to"
    ref: refId,                                  // REQUIRED - same for both rows
    debit: amount,                               // Money LEAVING
    credit: 0,                                   // Must be 0
  };

  console.log('Source Transaction:', JSON.stringify(sourceTransaction, null, 2));

  try {
    const sourceResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sourceTransaction),
    });

    const sourceResult = await sourceResponse.json();
    
    if (!sourceResponse.ok) {
      console.error('❌ Row A FAILED:', sourceResult.error || sourceResult.message || 'Unknown error');
      console.error('Full response:', JSON.stringify(sourceResult, null, 2));
      return;
    }
    
    console.log('✅ Row A created successfully\n');
  } catch (error) {
    console.error('❌ Row A network error:', error.message);
    return;
  }

  // ========================================
  // Row B: Destination Transaction (CREDIT)
  // ========================================
  console.log('📥 Creating Row B: Destination (money entering)...');
  const destinationTransaction = {
    day: today.getDate().toString(),
    month: getMonthAbbreviation(today.getMonth() + 1),
    year: today.getFullYear().toString(),
    property: '',                                // OPTIONAL for transfers
    typeOfOperation: 'Transfer',                 // Same as Row A
    typeOfPayment: toAccount,                    // Destination account
    detail: `Transfer from ${fromAccount}`,      // Must contain "Transfer from"
    ref: refId,                                  // SAME ref as Row A
    debit: 0,                                    // Must be 0
    credit: amount,                              // Money ENTERING
  };

  console.log('Destination Transaction:', JSON.stringify(destinationTransaction, null, 2));

  try {
    const destinationResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(destinationTransaction),
    });

    const destinationResult = await destinationResponse.json();
    
    if (!destinationResponse.ok) {
      console.error('❌ Row B FAILED:', destinationResult.error || destinationResult.message || 'Unknown error');
      console.error('Full response:', JSON.stringify(destinationResult, null, 2));
      return;
    }
    
    console.log('✅ Row B created successfully');
    console.log('\n🎉 TRANSFER COMPLETE!');
    console.log('\n📊 V9.1 Compliance Checklist:');
    console.log('   ✓ Two rows created with matching ref:', refId);
    console.log('   ✓ typeOfOperation = "Transfer" (from Data!F2)');
    console.log('   ✓ property field blank (optional for transfers)');
    console.log('   ✓ Row A: debit =', amount, ', credit = 0');
    console.log('   ✓ Row B: debit = 0, credit =', amount);
    console.log('   ✓ detail contains "Transfer to" / "Transfer from"');
    console.log('\n📈 Expected Backend Behavior:');
    console.log('   ✓ Appears in Transactions tab');
    console.log('   ✓ Located in Data!F2 category');
    console.log('   ✓ Excluded from P&L revenue/expense totals');
    console.log('   ✓ Updates Balance Summary correctly');
    console.log(`   ✓ ${fromAccount}: -₿${amount.toLocaleString()}`);
    console.log(`   ✓ ${toAccount}: +₿${amount.toLocaleString()}\n`);
    
  } catch (error) {
    console.error('❌ Row B network error:', error.message);
  }
}

// Run the test
testTransfer();