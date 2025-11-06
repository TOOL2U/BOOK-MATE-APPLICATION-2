// Test the manual entry API flow
const apiBaseUrl = 'https://accounting.siamoon.com';

async function testManualEntry() {
  try {
    console.log('🧪 Testing Manual Entry API flow...');
    
    // 1. Test getting dropdown options
    console.log('📡 Fetching dropdown options...');
    const optionsResponse = await fetch(`${apiBaseUrl}/api/options`);
    const options = await optionsResponse.json();
    
    if (options.data) {
      console.log('✅ Options fetched successfully!');
      console.log(`Properties: ${options.data.properties.length} items`);
      console.log(`Operations: ${options.data.typeOfOperations.length} items`);
      console.log(`Payments: ${options.data.typeOfPayment.length} items`);
    } else {
      console.log('❌ Failed to fetch options');
      return;
    }

    // 2. Test submitting a manual entry
    console.log('📝 Testing manual transaction submission...');
    const today = new Date();
    const testTransaction = {
      day: today.getDate().toString(),
      month: (today.getMonth() + 1).toString(), 
      year: today.getFullYear().toString(),
      property: options.data.properties[0], // Use first property
      typeOfOperation: 'EXP - Other Expenses', // Test expense
      typeOfPayment: options.data.typeOfPayment[0], // Use first payment type
      detail: 'Test manual entry from API update',
      ref: `MAN-TEST-${Date.now()}`,
      debit: 100,
      credit: 0,
    };

    const submitResponse = await fetch(`${apiBaseUrl}/api/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTransaction),
    });

    const submitResult = await submitResponse.json();
    
    if (submitResult.success) {
      console.log('✅ Manual entry submitted successfully!');
      console.log('Response:', submitResult);
    } else {
      console.log('❌ Manual entry submission failed');
      console.log('Error:', submitResult);
    }

  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

// Run the test
testManualEntry();