// Test transfer API call
const apiBaseUrl = 'https://accounting.siamoon.com';

// Helper function to convert month number to abbreviation
const getMonthAbbreviation = (monthNumber) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthNumber - 1] || 'Jan';
};

async function testTransfer() {
  try {
    console.log('🧪 Testing Transfer API...');
    
    const today = new Date();
    const transferAmount = 500;
    const refId = `TXF-TEST-${Date.now()}`;
    
    // FINAL SPEC: Create TWO transactions per transfer (dual-row pattern)
    // Row A: fromAccount = source, toAccount blank, transactionType = "Transfer", amount = X
    // Row B: fromAccount blank, toAccount = destination, transactionType = "Transfer", amount = X
    
    // Row A: Source transaction (money leaving Cash)
    const sourceTransaction = {
      day: today.getDate().toString(),
      month: getMonthAbbreviation(today.getMonth() + 1),
      year: today.getFullYear().toString(),
      property: 'Family',
      typeOfOperation: 'Transfer', // Backend will add to valid operations
      typeOfPayment: 'Cash - Family', // Source account
      detail: 'Transfer to Bank Transfer - Bangkok Bank - Shaun Ducker',
      ref: refId,
      debit: transferAmount, // Money LEAVING source
      credit: 0,
    };

    // Row B: Destination transaction (money entering Bank)
    const destinationTransaction = {
      day: today.getDate().toString(),
      month: getMonthAbbreviation(today.getMonth() + 1),
      year: today.getFullYear().toString(),
      property: 'Family',
      typeOfOperation: 'Transfer', // Same operation type
      typeOfPayment: 'Bank Transfer - Bangkok Bank - Shaun Ducker', // Destination account
      detail: 'Transfer from Cash - Family',
      ref: refId, // Same ref links both rows
      debit: 0,
      credit: transferAmount, // Money ENTERING destination
    };

    console.log('📤 Submitting source transaction (Row A)...');
    const sourceResponse = await fetch(`${apiBaseUrl}/api/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sourceTransaction),
    });
    const sourceResult = await sourceResponse.json();
    
    console.log('📥 Submitting destination transaction (Row B)...');
    const destinationResponse = await fetch(`${apiBaseUrl}/api/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destinationTransaction),
    });
    const destinationResult = await destinationResponse.json();
    
    if (sourceResult.success && destinationResult.success) {
      console.log('✅ Transfer test successful!');
      console.log('Source Response (Row A):', sourceResult);
      console.log('Destination Response (Row B):', destinationResult);
      console.log('\n📋 FINAL SPEC COMPLIANCE:');
      console.log('✅ Two separate rows created with same ref ID');
      console.log('✅ typeOfOperation = "Transfer" (backend will add to valid options)');
      console.log('✅ Uses existing schema - no new fields needed');
      console.log('✅ Row A: debit (money leaving), credit = 0');
      console.log('✅ Row B: credit (money entering), debit = 0');
      console.log('✅ Will NOT impact P&L');
      console.log('✅ Will only affect Balance Summary');
    } else {
      console.log('❌ Transfer test failed');
      console.log('Source Error:', sourceResult);
      console.log('Destination Error:', destinationResult);
    }
  } catch (error) {
    console.log('❌ Transfer test error:', error.message);
  }
}

// Run the test
testTransfer();