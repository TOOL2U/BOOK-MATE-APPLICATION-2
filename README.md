# 📱 Accounting Buddy Mobile Application

A React Native mobile app for receipt processing and accounting management, built with Expo and TypeScript.

---

## 🚨 CRITICAL UPDATE - October 30, 2025

**Dropdown values have been corrected!**

The initial implementation contained incorrect dropdown values. All values have been corrected and verified.

📄 **See:** `CRITICAL_UPDATE_DROPDOWN_VALUES.md` for complete details.

✅ **Status:** All dropdown values in `src/types/index.ts` are now correct and ready for use.

---

## 🚀 PHASE 2 IN PROGRESS - October 30, 2025

**Phase 2 development has started!**

✅ **Completed:**
- Dropdown pickers for Property, Category, and Payment Type
- Professional icon library integrated (replaced emoji icons)

📄 **See:** `PHASE_2_PROGRESS.md` for complete details.

🎯 **Next:** Review screen for extracted receipt data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- iOS Simulator (for Mac) or Android Emulator
- Expo Go app on your physical device (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TOOL2U/AccountingBuddy-App.git
   cd accounting-buddy-mobile-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API credentials
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📋 Features

### ✅ Phase 1 - MVP (Current)
- [x] Project setup with Expo + TypeScript
- [x] Navigation structure (5 tabs)
- [x] API service layer with retry logic
- [x] Upload receipt (Camera + Gallery)
- [x] OCR text extraction
- [x] AI-powered data extraction
- [x] Manual entry form
- [x] Balance tracking
- [x] P&L Dashboard
- [x] Inbox/History view

### 🚧 Phase 2 - Coming Soon
- [ ] Dropdown pickers for categories
- [ ] Review screen for extracted data
- [ ] Enhanced error handling
- [ ] Offline support
- [ ] Local caching
- [ ] Push notifications

## 🏗️ Project Structure

```
accounting-buddy-mobile-application/
├── App.tsx                          # Main app entry point
├── src/
│   ├── screens/                     # Screen components
│   │   ├── UploadScreen.tsx        # Receipt upload & OCR
│   │   ├── ManualEntryScreen.tsx   # Manual transaction entry
│   │   ├── BalanceScreen.tsx       # Balance tracking
│   │   ├── PLScreen.tsx            # P&L dashboard
│   │   └── InboxScreen.tsx         # Transaction history
│   ├── services/
│   │   └── api.ts                  # API service layer
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   └── config/
│       └── api.ts                  # API configuration
├── assets/                          # Images and icons
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## 🔌 API Integration

This app connects to the existing **Accounting Buddy Web API** hosted on Vercel.

**Base URL:** `https://accounting-buddy-app.vercel.app/api`

### Key Endpoints
- `POST /api/ocr` - Extract text from receipt image
- `POST /api/extract` - AI extraction from OCR text
- `POST /api/sheets` - Submit transaction to Google Sheets
- `GET /api/inbox` - Fetch all transactions
- `GET /api/pnl` - Fetch P&L KPI data
- `GET /api/balance/get` - Fetch balances
- `POST /api/balance/save` - Save balance entry

See [MOBILE_API_INTEGRATION_GUIDE.md](./MOBILE_API_INTEGRATION_GUIDE.md) for complete API documentation.

## 🎨 Tech Stack

- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **Navigation:** React Navigation 7
- **Styling:** NativeWind (Tailwind CSS)
- **HTTP Client:** Axios
- **Camera/Photos:** expo-image-picker, expo-camera

## 🧪 Testing API Connectivity

Test the API endpoints before running the app:

```bash
# Test health check
curl https://accounting-buddy-app.vercel.app/api/sheets

# Test P&L endpoint
curl https://accounting-buddy-app.vercel.app/api/pnl

# Test balance endpoint
curl https://accounting-buddy-app.vercel.app/api/balance/get
```

## 📱 Screens Overview

### 1. Upload Screen
- Take photo with camera
- Select from gallery
- OCR text extraction
- AI-powered field extraction

### 2. Manual Entry Screen
- 10-field transaction form
- Date, property, category, payment type
- Debit/credit amounts
- Reference number

### 3. Balance Screen
- View all bank and cash balances
- Total balance summary
- Last updated timestamps
- Pull-to-refresh

### 4. P&L Dashboard
- Month and year KPIs
- Revenue, overheads, GOP
- EBITDA margin
- Color-coded cards

### 5. Inbox Screen
- Transaction history
- Delete transactions
- Pull-to-refresh
- Debit/credit indicators

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
API_BASE_URL=https://accounting-buddy-app.vercel.app/api
AUTH_SECRET=your_secret_here
```

## 🐛 Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npm start -- --clear
```

**iOS build issues:**
```bash
cd ios && pod install && cd ..
```

**TypeScript errors:**
```bash
npm install --save-dev @types/react @types/react-native
```

## 📄 License

ISC

## 👥 Author

**Sia Moon** (shaunducker1@gmail.com)

## 🔗 Related Projects

- [Accounting Buddy Web App](https://accounting.siamoon.com)
- [Backend Repository](https://github.com/TOOL2U/AccountingBuddy)

---

**Ready to build! 🚀**

