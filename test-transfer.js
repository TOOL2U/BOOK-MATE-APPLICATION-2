// Test transfer API call
const apiBaseUrl = 'https://accounting.siamoon.com';

async function testTransfer() {
  try {
    console.log('🧪 Testing Transfer API...');
    
    const today = new Date();
    const transferAmount = 500;
    const refId = `TXF-TEST-${Date.now()}`;
    
    // Debit transaction (money leaving Cash)
    const debitTransaction = {
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
      property: 'Family', // Using valid property
      typeOfOperation: 'EXP - Transfer', // Using existing transfer operation
      typeOfPayment: 'Cash - Family', // Using exact payment type
      detail: 'Test transfer from Cash to Bank (Debit)',
      ref: refId,
      debit: transferAmount,
      credit: 0,
    };

    // Credit transaction (money entering Bank)
    const creditTransaction = {
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(),
      year: today.getFullYear().toString(),
      property: 'Shaun Ducker - Personal', // Using valid property
      typeOfOperation: 'Revenue - Transfer', // Using existing revenue transfer operation
      typeOfPayment: 'Bank Transfer - Bangkok Bank - Shaun Ducker',
      detail: 'Test transfer from Cash to Bank (Credit)',
      ref: refId,
      debit: 0,
      credit: transferAmount,
    };

    console.log('📤 Submitting debit transaction...');
    const debitResponse = await fetch(`${apiBaseUrl}/api/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(debitTransaction),
    });
    const debitResult = await debitResponse.json();
    
    console.log('📥 Submitting credit transaction...');
    const creditResponse = await fetch(`${apiBaseUrl}/api/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creditTransaction),
    });
    const creditResult = await creditResponse.json();
    
    if (debitResult.success && creditResult.success) {
      console.log('✅ Transfer test successful!');
      console.log('Debit Response:', debitResult);
      console.log('Credit Response:', creditResult);
    } else {
      console.log('❌ Transfer test failed');
      console.log('Debit Error:', debitResult);
      console.log('Credit Error:', creditResult);
    }
  } catch (error) {
    console.log('❌ Transfer test error:', error.message);
  }
}

// Run the test
testTransfer();