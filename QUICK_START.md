# ⚡ Quick Start - BookMate Mobile

Get the app running in 5 minutes!

## 🎯 Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac) or Android Emulator
- OR Expo Go app on your phone

## 🚀 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Dropdown Values
```bash
node verify-dropdown-values.js
```

Expected output:
```
✅ ALL CHECKS PASSED!
```

### 3. Test API Connection
```bash
node test-api.js
```

Expected output:
```
✓ Health Check passed
⚠ Some endpoints may need backend configuration
```

### 4. Start Development Server
```bash
npm start
```

### 5. Run the App

**Option A: iOS Simulator (Mac only)**
```bash
# Press 'i' in the terminal
# OR
npm run ios
```

**Option B: Android Emulator**
```bash
# Press 'a' in the terminal
# OR
npm run android
```

**Option C: Physical Device**
1. Install **Expo Go** from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

## 📱 What You'll See

The app has 5 tabs:

1. **📸 Upload** - Take photo or select from gallery
2. **✏️ Manual** - Enter transaction manually
3. **💰 Balance** - View bank and cash balances
4. **📊 P&L** - View profit & loss dashboard
5. **📥 Inbox** - View transaction history

## 🧪 Test the Features

### Upload Screen
1. Tap "Take Photo" or "Choose from Gallery"
2. Grant camera/photo permissions
3. Select a receipt image
4. Watch OCR processing (takes 2-3 seconds)
5. See extracted text

### Manual Entry
1. Fill in transaction details
2. Enter debit or credit amount
3. Tap "Submit Transaction"
4. See success message

### Balance Screen
1. Pull down to refresh
2. View total balance
3. See individual bank balances

### P&L Dashboard
1. Pull down to refresh
2. View month KPIs
3. View year KPIs

### Inbox
1. Pull down to refresh
2. View transaction list
3. Tap 🗑️ to delete a transaction

## ⚠️ Expected Behavior

Some API endpoints may show errors like:
- "P&L endpoint not configured"
- "Balance service not configured"

**This is normal!** The backend environment variables need to be set on Vercel. The app handles these errors gracefully.

## 🐛 Troubleshooting

### Metro bundler won't start
```bash
npm start -- --clear
```

### TypeScript errors
```bash
npm install --save-dev @types/react @types/react-native
```

### Camera not working
- Check permissions in Settings > Expo Go
- Restart the app

### API errors
- Check internet connection
- Verify API_BASE_URL in .env file
- Run `node test-api.js` to test connectivity

## 📚 Next Steps

1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Read [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current status
3. Read [MOBILE_API_INTEGRATION_GUIDE.md](./MOBILE_API_INTEGRATION_GUIDE.md) for API docs

## 🎉 You're Ready!

The app is now running. Start testing features and exploring the code!

---

**Need help?** Check the documentation files or contact the team.

