// Comprehensive Balance Screen Calculation Verification
console.log('=== BALANCE SCREEN CALCULATION VERIFICATION ===');
console.log('');

// Test the balance API endpoint
async function testBalanceCalculations() {
  try {
    const fetch = require('https');
    
    // Test Balance API
    console.log('1. TESTING BALANCE API ENDPOINT:');
    console.log('================================');
    
    const balanceUrl = 'https://accounting.siamoon.com/api/balance';
    
    // Make API call using HTTPS
    return new Promise((resolve, reject) => {
      const req = fetch.request(balanceUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const balanceData = JSON.parse(data);
            
            console.log('Balance API Response Structure:');
            console.log('- Status:', balanceData.ok ? '✅ OK' : '❌ Error');
            console.log('- Items Count:', balanceData.items?.length || 0);
            console.log('');
            
            if (balanceData.items && balanceData.items.length > 0) {
              console.log('Individual Account Analysis:');
              console.log('============================');
              
              let totalApiBalance = 0;
              let totalCalculated = 0;
              let totalVariance = 0;
              
              balanceData.items.forEach((account, index) => {
                console.log(`Account ${index + 1}: ${account.accountName || 'Unknown'}`);
                
                const opening = account.openingBalance || 0;
                const inflow = account.inflow || 0;
                const outflow = account.outflow || 0;
                const apiBalance = account.currentBalance || 0;
                const calculated = opening + inflow - outflow;
                const difference = apiBalance - calculated;
                
                console.log(`  Opening Balance: ฿${opening.toLocaleString()}`);
                console.log(`  Inflows:         ฿${inflow.toLocaleString()}`);
                console.log(`  Outflows:        ฿${outflow.toLocaleString()}`);
                console.log(`  Calculated:      ฿${calculated.toLocaleString()}`);
                console.log(`  API Balance:     ฿${apiBalance.toLocaleString()}`);
                console.log(`  Difference:      ฿${difference.toLocaleString()} ${Math.abs(difference) < 0.01 ? '✅' : '❌'}`);
                console.log(`  Last Updated:    ${account.lastTxnAt || 'N/A'}`);
                console.log('');
                
                totalApiBalance += apiBalance;
                totalCalculated += calculated;
                totalVariance += Math.abs(difference);
              });
              
              console.log('SUMMARY TOTALS:');
              console.log('===============');
              console.log(`Total API Balance:    ฿${totalApiBalance.toLocaleString()}`);
              console.log(`Total Calculated:     ฿${totalCalculated.toLocaleString()}`);
              console.log(`Total Variance:       ฿${totalVariance.toLocaleString()}`);
              console.log(`All Balances Valid:   ${totalVariance < 0.01 ? '✅ YES' : '❌ NO'}`);
              console.log('');
              
              // Test the screen's total balance calculation
              console.log('2. BALANCE SCREEN TOTAL CALCULATION:');
              console.log('====================================');
              const screenTotal = balanceData.items.reduce((sum, b) => sum + (b.currentBalance || 0), 0);
              console.log(`Screen displays total: ฿${screenTotal.toLocaleString()}`);
              console.log(`Matches sum of parts:  ${screenTotal === totalApiBalance ? '✅ YES' : '❌ NO'}`);
              console.log('');
              
              // Test verification service logic
              console.log('3. VERIFICATION SERVICE LOGIC:');
              console.log('===============================');
              let validAccounts = 0;
              let invalidAccounts = 0;
              
              balanceData.items.forEach(account => {
                const opening = account.openingBalance || 0;
                const inflow = account.inflow || 0;
                const outflow = account.outflow || 0;
                const apiBalance = account.currentBalance || 0;
                const calculated = opening + inflow - outflow;
                const difference = Math.abs(apiBalance - calculated);
                
                if (difference < 0.01) {
                  validAccounts++;
                } else {
                  invalidAccounts++;
                }
              });
              
              console.log(`Valid Accounts:    ${validAccounts}/${balanceData.items.length}`);
              console.log(`Invalid Accounts:  ${invalidAccounts}/${balanceData.items.length}`);
              console.log(`Verification Rate: ${((validAccounts/balanceData.items.length)*100).toFixed(1)}%`);
              console.log('');
              
              // Check for common calculation issues
              console.log('4. POTENTIAL CALCULATION ISSUES:');
              console.log('=================================');
              let issuesFound = [];
              
              balanceData.items.forEach(account => {
                const opening = account.openingBalance || 0;
                const inflow = account.inflow || 0;
                const outflow = account.outflow || 0;
                const apiBalance = account.currentBalance || 0;
                
                if (opening === null || opening === undefined) {
                  issuesFound.push(`${account.accountName}: Missing opening balance`);
                }
                if (inflow < 0) {
                  issuesFound.push(`${account.accountName}: Negative inflow (${inflow})`);
                }
                if (outflow < 0) {
                  issuesFound.push(`${account.accountName}: Negative outflow (${outflow})`);
                }
                if (apiBalance === null || apiBalance === undefined) {
                  issuesFound.push(`${account.accountName}: Missing current balance`);
                }
              });
              
              if (issuesFound.length === 0) {
                console.log('✅ No calculation issues detected');
              } else {
                console.log('❌ Issues found:');
                issuesFound.forEach(issue => console.log(`  - ${issue}`));
              }
              
            } else {
              console.log('❌ No balance data returned from API');
            }
            
            resolve(true);
          } catch (parseError) {
            console.error('Error parsing balance data:', parseError);
            reject(parseError);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('API request error:', error);
        reject(error);
      });
      
      req.end();
    });
    
  } catch (error) {
    console.error('Balance calculation test failed:', error);
    return false;
  }
}

// Run the test
if (typeof require !== 'undefined') {
  testBalanceCalculations()
    .then(() => {
      console.log('');
      console.log('✅ Balance calculation verification completed');
      console.log('📊 Check above results to verify all numbers are calculated correctly');
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
    });
} else {
  console.log('This test requires Node.js environment');
}