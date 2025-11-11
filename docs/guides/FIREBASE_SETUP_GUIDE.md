# Firebase Setup Guide for BookMate iOS

**Version:** 1.0  
**Last Updated:** November 11, 2025  
**For:** Phase 4 - Post-Launch Monitoring

---

## 📋 Prerequisites

- [ ] Firebase account (https://console.firebase.google.com)
- [ ] Google account with admin access
- [ ] BookMate iOS project ready
- [ ] Xcode installed (for iOS build)

---

## 🔧 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `BookMate Production`
4. Click **"Continue"**
5. **Enable Google Analytics:** ✅ Yes
6. Select or create Analytics account: `Sia Moon` or `BookMate`
7. Click **"Create project"**
8. Wait for project to be created (~30 seconds)
9. Click **"Continue"**

---

### 2. Add iOS App to Firebase Project

1. In Firebase Console, click **"Add app"** → **iOS** (Apple icon)

2. **Register App:**
   - **iOS bundle ID:** `com.siamoon.bookmate`
   - **App nickname (optional):** `BookMate iOS`
   - **App Store ID (optional):** Leave blank for now (add after approval)
   - Click **"Register app"**

3. **Download Config File:**
   - Click **"Download GoogleService-Info.plist"**
   - Save to your computer
   - **DO NOT commit this file to git!**

4. **Add Config File to Project:**
   ```bash
   # Move to project root (same level as app.json)
   mv ~/Downloads/GoogleService-Info.plist /path/to/BOOK-MATE-APPLICATION-2/
   
   # Add to .gitignore
   echo "GoogleService-Info.plist" >> .gitignore
   ```

5. **For Xcode (Important):**
   - Open project in Xcode:
     ```bash
     cd ios
     open BookMate.xcworkspace
     ```
   - Drag `GoogleService-Info.plist` into Xcode project navigator
   - Place it under the `BookMate` folder (not root)
   - Check **"Copy items if needed"**
   - Ensure it's added to target: `BookMate`

6. Click **"Next"** in Firebase Console (skip SDK step for now)

7. Click **"Continue to console"**

---

### 3. Install Firebase SDK

```bash
# Navigate to project directory
cd /Users/shaunducker/Desktop/BookMate\ Mobile\ Application/BOOK-MATE-APPLICATION-2

# Install Firebase packages
npm install --save @react-native-firebase/app
npm install --save @react-native-firebase/analytics
npm install --save @react-native-firebase/crashlytics

# iOS: Install pods
cd ios
pod install
cd ..
```

**Expected Output:**
```
✅ @react-native-firebase/app@latest
✅ @react-native-firebase/analytics@latest
✅ @react-native-firebase/crashlytics@latest

📦 Installing 15 dependencies...
```

---

### 4. Configure Firebase in Xcode (iOS)

#### 4.1 Enable Firebase in AppDelegate

**Edit:** `ios/BookMate/AppDelegate.mm`

```objc
// Add import at the top
#import <Firebase.h>

// Inside didFinishLaunchingWithOptions, add BEFORE return YES:
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"BookMate";
  self.initialProps = @{};

  // ✅ ADD THIS LINE
  [FIRApp configure];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

#### 4.2 Enable Crashlytics in Xcode Build Phase

1. Open Xcode workspace:
   ```bash
   cd ios
   open BookMate.xcworkspace
   ```

2. Select **BookMate** project in navigator (left sidebar)

3. Select **BookMate** target

4. Click **"Build Phases"** tab

5. Click **"+"** → **"New Run Script Phase"**

6. Drag the new phase **ABOVE** "Compile Sources"

7. Rename to: `Firebase Crashlytics`

8. Paste this script:
   ```bash
   "${PODS_ROOT}/FirebaseCrashlytics/run"
   ```

9. Add input files:
   ```
   ${DWARF_DSYM_FOLDER_PATH}/${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/${TARGET_NAME}
   $(SRCROOT)/$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)
   ```

10. Save (Cmd+S)

---

### 5. Initialize Firebase in App.tsx

**Edit:** `App.tsx`

```typescript
import React, { useEffect } from 'react';
import firebase from './src/services/firebase';

export default function App() {
  useEffect(() => {
    // Initialize Firebase on app startup
    firebase.initialize();
    
    // Log app open event
    firebase.logAppOpen();
    
    // Set initial user properties
    firebase.setUserProperty('app_version', '1.0.1');
    firebase.setUserProperty('platform', 'ios');
  }, []);

  // ... rest of your app code
  
  return (
    // Your app JSX
  );
}
```

---

### 6. Add Analytics Events to Screens

#### Example: Dashboard Screen

**Edit:** `src/screens/DashboardScreen.tsx`

```typescript
import React, { useEffect } from 'react';
import firebase from '../services/firebase';

export default function DashboardScreen() {
  useEffect(() => {
    // Log screen view
    firebase.logScreenView('Dashboard', 'DashboardScreen');
  }, []);

  // ... rest of component
}
```

#### Example: Receipt Scan Screen

**Edit:** `src/screens/ReceiptScanScreen.tsx`

```typescript
import firebase from '../services/firebase';

const handlePhotoTaken = async (photo) => {
  try {
    const result = await uploadReceipt(photo);
    
    // Log successful scan
    firebase.logReceiptScanned('camera', true, result.amount);
  } catch (error) {
    // Log failed scan
    firebase.logReceiptScanned('camera', false);
    firebase.logError(error as Error, 'Receipt scan failed');
  }
};
```

#### Example: Manual Entry Screen

**Edit:** `src/screens/ManualEntryScreen.tsx`

```typescript
import firebase from '../services/firebase';

const handleSubmit = async () => {
  try {
    await submitManualEntry(formData);
    
    // Log successful manual entry
    firebase.logManualEntry(
      formData.category, 
      formData.amount, 
      formData.property !== null
    );
  } catch (error) {
    firebase.logError(error as Error, 'Manual entry failed');
  }
};
```

#### Example: P&L Report Screen

**Edit:** `src/screens/PLReportScreen.tsx`

```typescript
import firebase from '../services/firebase';

const handlePeriodChange = (period: 'month' | 'year') => {
  setPeriod(period);
  
  // Log report view
  firebase.logReportViewed(period, plData.length > 0);
};
```

---

### 7. Add Error Logging to API Service

**Edit:** `src/services/api.ts` (or wherever you make API calls)

```typescript
import firebase from './firebase';

export const fetchBalance = async () => {
  try {
    const response = await fetch(`${API_URL}/balance`, {
      headers: { 'X-Webhook-Secret': WEBHOOK_SECRET }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log API error to Firebase
    firebase.logAPIError('/balance', 500, (error as Error).message);
    throw error;
  }
};
```

---

### 8. Test Firebase Integration

#### 8.1 Build the App

```bash
# iOS
npm run ios

# Or with EAS
eas build --platform ios --profile development
```

#### 8.2 Verify Events in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select **BookMate Production** project
3. Go to **Analytics** → **Dashboard**
4. Wait 5-10 minutes for events to appear
5. Check for:
   - `app_open` event
   - `screen_view` events
   - Custom events (receipt_scanned, etc.)

**Note:** Analytics events have a delay of up to 24 hours in production.

#### 8.3 Test Crashlytics

**For Development Testing:**

```typescript
// Add a test button in your app (remove before production!)
import firebase from './src/services/firebase';

<Button 
  title="Test Crash" 
  onPress={() => {
    firebase.logError(new Error('Test error from dev'), 'Test context');
  }}
/>
```

**To test real crash:**
```typescript
// ⚠️ WARNING: This will crash the app!
firebase.crash();
```

1. Trigger the test crash
2. Restart the app
3. Go to Firebase Console → **Crashlytics**
4. Wait 5 minutes for crash to appear
5. Verify crash report shows up

---

### 9. Production Build

#### 9.1 Update EAS Build Profile

**Edit:** `eas.json`

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "distribution": "store"
      }
    }
  }
}
```

#### 9.2 Build with Firebase

```bash
# Build production version
eas build --platform ios --profile production

# This will include Firebase SDK and GoogleService-Info.plist
```

#### 9.3 Verify Build Includes Firebase

1. Download `.ipa` from EAS dashboard
2. Unzip (rename to `.zip` and extract)
3. Check `Payload/BookMate.app/GoogleService-Info.plist` exists
4. Submit to App Store Connect

---

## 🔍 Monitoring & Dashboards

### Firebase Console Bookmarks

**Analytics Dashboard:**
```
https://console.firebase.google.com/project/bookmate-production/analytics/app/ios:com.siamoon.bookmate/overview
```

**Crashlytics Dashboard:**
```
https://console.firebase.google.com/project/bookmate-production/crashlytics/app/ios:com.siamoon.bookmate/issues
```

**Performance Dashboard (if enabled):**
```
https://console.firebase.google.com/project/bookmate-production/performance/app/ios:com.siamoon.bookmate/trends
```

---

## 🚨 Troubleshooting

### Issue: "Firebase not initialized"

**Solution:**
```typescript
// Make sure firebase.initialize() is called in App.tsx useEffect
useEffect(() => {
  firebase.initialize();
}, []);
```

### Issue: "GoogleService-Info.plist not found"

**Solution:**
1. Check file is in project root
2. Check file is added to Xcode target
3. Rebuild: `cd ios && pod install && cd ..`

### Issue: "Events not showing in Firebase Console"

**Solutions:**
1. Wait 24 hours (analytics has delay)
2. Check you're in production build (not `__DEV__`)
3. Verify `GoogleService-Info.plist` has correct `GOOGLE_APP_ID`
4. Use Firebase DebugView for real-time testing

### Issue: "Crashes not appearing in Crashlytics"

**Solutions:**
1. Ensure `[FIRApp configure]` is in AppDelegate
2. Check Crashlytics build phase is added in Xcode
3. Crash must happen, app restart, then report sends
4. Wait 5-10 minutes after restart

### Enable Firebase Debug Logging

**iOS:**
```bash
# Edit scheme in Xcode
# Product → Scheme → Edit Scheme → Run → Arguments
# Add: -FIRDebugEnabled
```

---

## 📊 Key Metrics to Track

### Daily (First Week)
- [ ] Active users
- [ ] Crash-free users %
- [ ] Most used features
- [ ] API error rate

### Weekly
- [ ] User retention (Day 1, Day 7)
- [ ] Session duration
- [ ] Feature adoption %
- [ ] Top crashes

### Monthly
- [ ] Monthly active users (MAU)
- [ ] Churn rate
- [ ] Feature usage trends
- [ ] Performance metrics

---

## ✅ Setup Checklist

- [ ] Firebase project created
- [ ] iOS app added to Firebase
- [ ] GoogleService-Info.plist downloaded
- [ ] GoogleService-Info.plist added to Xcode project
- [ ] GoogleService-Info.plist added to .gitignore
- [ ] Firebase SDK installed (`npm install`)
- [ ] Pods installed (`pod install`)
- [ ] AppDelegate updated with `[FIRApp configure]`
- [ ] Crashlytics build phase added in Xcode
- [ ] FirebaseService created (src/services/firebase.ts)
- [ ] Firebase initialized in App.tsx
- [ ] Analytics events added to key screens
- [ ] Error logging added to API calls
- [ ] Test build created and verified
- [ ] Production build includes Firebase
- [ ] Firebase Console dashboards bookmarked
- [ ] Team trained on monitoring

---

## 📚 Additional Resources

**Firebase Docs:**
- [Firebase for React Native](https://rnfirebase.io/)
- [Analytics Events](https://rnfirebase.io/analytics/usage)
- [Crashlytics Setup](https://rnfirebase.io/crashlytics/usage)

**Best Practices:**
- [Firebase Performance Best Practices](https://firebase.google.com/docs/perf-mon/get-started-ios)
- [Analytics Event Naming](https://support.google.com/analytics/answer/9267735)

---

**Setup Time:** ~45 minutes  
**Created:** November 11, 2025  
**For:** BookMate iOS v1.0.1
