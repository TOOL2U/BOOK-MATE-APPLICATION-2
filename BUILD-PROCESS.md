# Build Process & Deployment Guide
**BookMate Mobile Application**  
Version: 1.0.0  
Last Updated: November 11, 2025

---

## Prerequisites

### Required Software
- **Node.js:** v18+ (LTS recommended)
- **npm:** v9+ or **yarn:** v1.22+
- **Expo CLI:** `npm install -g eas-cli`
- **EAS CLI:** Already installed globally

### Required Accounts
- **Expo Account:** Create at https://expo.dev
- **Apple Developer Account:** $99/year (for iOS)
- **Google Play Developer Account:** $25 one-time (for Android)

### Environment Setup
```bash
# Clone repository
git clone https://github.com/TOOL2U/BOOK-MATE-APPLICATION-2.git
cd BOOK-MATE-APPLICATION-2

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with production values
nano .env
```

**Required Environment Variables:**
```bash
EXPO_PUBLIC_API_BASE_URL=https://accounting.siamoon.com/api
EXPO_PUBLIC_AUTH_SECRET=your_actual_secret_here
```

---

## Build Profiles

### 1. Development Build
**Purpose:** Local testing with dev client  
**Command:** `eas build --profile development --platform ios`

**Features:**
- Development client included
- Hot reloading
- Debug logging enabled
- Internal distribution only

### 2. Preview Build
**Purpose:** Internal testing on real devices  
**Command:** `eas build --profile preview --platform ios`

**Features:**
- Production-like environment
- Can install via TestFlight/Internal Testing
- Faster than production build
- Useful for QA

### 3. Production Build
**Purpose:** App Store/Play Store submission  
**Command:** `eas build --profile production --platform ios`

**Features:**
- Optimized bundle
- Debug logging disabled
- Crash reporting enabled
- Minified code
- Production API endpoints

---

## iOS Build Process

### Step 1: Configure Apple Developer Account

```bash
# Login to EAS
eas login

# Configure project
eas build:configure
```

**Apple Developer Setup:**
1. Go to https://developer.apple.com
2. Create App ID: `com.siamoon.bookmate`
3. Create provisioning profiles
4. Add devices for testing (if needed)

### Step 2: Update Build Configuration

**app.json:**
```json
{
  "expo": {
    "name": "BookMate",
    "slug": "bookmate-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.siamoon.bookmate",
      "buildNumber": "1"
    }
  }
}
```

**eas.json:**
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.siamoon.bookmate",
        "resourceClass": "m-medium"
      }
    }
  }
}
```

### Step 3: Build for iOS

```bash
# Production build
eas build --profile production --platform ios

# Preview build (faster, for testing)
eas build --profile preview --platform ios
```

**Build will:**
- ✅ Upload code to EAS servers
- ✅ Compile on Apple infrastructure
- ✅ Generate .ipa file
- ✅ Sign with your certificates
- ✅ Provide download link

**Build time:** ~15-20 minutes

### Step 4: Download & Test

```bash
# Download .ipa
# Link will be provided in terminal and on Expo dashboard

# Install on device via Xcode or TestFlight
```

**Local testing (simulator):**
```bash
eas build --profile preview --platform ios --local
```

---

## Android Build Process

### Step 1: Create Keystore

```bash
# Generate keystore (only once)
keytool -genkeypair -v -keystore bookmate-release.keystore \
  -alias bookmate -keyalg RSA -keysize 2048 -validity 10000

# Save credentials securely
# - Keystore password
# - Key password
# - Alias name
```

**Store keystore securely:**
- ❌ Do NOT commit to git
- ✅ Store in password manager
- ✅ Backup in secure location

### Step 2: Configure EAS Secrets

```bash
# Add keystore to EAS
eas credentials
```

**Steps:**
1. Select Android → Production
2. Upload keystore file
3. Enter passwords
4. Confirm

### Step 3: Build for Android

```bash
# Production build (AAB for Play Store)
eas build --profile production --platform android

# Preview build (APK for testing)
eas build --profile preview --platform android
```

**Build will generate:**
- **Production:** `.aab` (Android App Bundle) - for Play Store
- **Preview:** `.apk` (Android Package) - for direct install

### Step 4: Test APK

```bash
# Download .apk
# Install on Android device:
adb install path/to/bookmate.apk
```

---

## Build Both Platforms

```bash
# Build iOS + Android simultaneously
eas build --profile production --platform all
```

---

## Version Management

### Incrementing Version Numbers

**For minor updates (1.0.0 → 1.0.1):**
```json
// app.json
{
  "version": "1.0.1",
  "ios": {
    "buildNumber": "2"  // Increment
  },
  "android": {
    "versionCode": 2    // Increment
  }
}
```

**For major updates (1.0.0 → 1.1.0):**
```json
{
  "version": "1.1.0",
  "ios": {
    "buildNumber": "1"  // Reset or continue
  },
  "android": {
    "versionCode": 3    // Always increment
  }
}
```

**Version naming convention:**
- **1.0.0** - Major.Minor.Patch
- **1** - Build number (iOS) / Version code (Android)

---

## App Store Submission (iOS)

### Step 1: Create App on App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in details:
   - **Platform:** iOS
   - **Name:** BookMate
   - **Primary Language:** English
   - **Bundle ID:** com.siamoon.bookmate
   - **SKU:** bookmate-ios-1.0

### Step 2: Prepare App Information

**Required:**
- App name
- Subtitle (optional)
- Privacy Policy URL
- App Category: Finance or Business
- Age Rating: 4+
- Description (4000 chars max)
- Keywords (100 chars max)
- Support URL
- Marketing URL (optional)

**Screenshots (required):**
- 6.7" display (iPhone 14 Pro Max): 1290 x 2796 px
- 6.5" display (iPhone 11 Pro Max): 1242 x 2688 px
- 5.5" display (iPhone 8 Plus): 1242 x 2208 px

**Need 3-8 screenshots per size**

### Step 3: Upload Build via EAS Submit

```bash
# Submit to App Store
eas submit --profile production --platform ios
```

**Or manually:**
1. Download .ipa from EAS
2. Use Transporter app
3. Upload to App Store Connect

### Step 4: Submit for Review

1. Fill in "What's New" section
2. Select build
3. Set pricing (Free or paid)
4. Submit for review

**Review time:** 1-3 days typically

---

## Play Store Submission (Android)

### Step 1: Create App on Google Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in details:
   - **App name:** BookMate
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free (or paid)

### Step 2: Complete Store Listing

**Required:**
- App name
- Short description (80 chars)
- Full description (4000 chars)
- App icon: 512 x 512 px
- Feature graphic: 1024 x 500 px
- Screenshots: At least 2, up to 8
  - Phone: 320-3840 px (any dimension)
  - Tablet: 1200-7680 px (any dimension)
- Privacy Policy URL
- App category: Finance or Business
- Contact email

### Step 3: Upload AAB

```bash
# Submit to Play Store
eas submit --profile production --platform android
```

**Or manually:**
1. Go to Play Console → Production → Create new release
2. Upload .aab file
3. Fill in release notes
4. Save

### Step 4: Submit for Review

1. Complete all required sections
2. Set countries/regions
3. Set content rating (ESRB, PEGI)
4. Fill out questionnaire
5. Submit for review

**Review time:** 1-7 days typically

---

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/build.yml`:

```yaml
name: EAS Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm install
        
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS
        run: eas build --profile production --platform ios --non-interactive
        
      - name: Build Android
        run: eas build --profile production --platform android --non-interactive
```

**Required Secrets:**
- `EXPO_TOKEN` - from `eas whoami`

---

## Troubleshooting

### Common Build Errors

**Error: "Provisioning profile doesn't include signing certificate"**
```bash
# Fix: Clear credentials and reconfigure
eas credentials
# Select iOS → Production → Remove all → Regenerate
```

**Error: "Bundle identifier mismatch"**
- Ensure `app.json` and `eas.json` use same bundle ID
- Check Apple Developer portal for correct App ID

**Error: "Build timed out"**
- Increase resource class in `eas.json`
- Check for infinite loops or large assets

**Error: "Unable to resolve module"**
- Clear cache: `npm start -- --clear`
- Delete node_modules: `rm -rf node_modules && npm install`

### Logs & Debugging

```bash
# View build logs
eas build:list

# View specific build
eas build:view [build-id]

# Download build artifacts
eas build:download [build-id]
```

---

## Local Testing Before Build

### iOS Simulator
```bash
# Start simulator
npm run ios
```

### Android Emulator
```bash
# Start emulator
npm run android
```

### Production Mode Test
```bash
# Build and test locally
npm run build

# Or
expo export
# Then serve the dist folder
```

---

## Checklist Before Submission

### Technical
- [ ] Version numbers incremented
- [ ] Bundle identifiers correct
- [ ] All environment variables set
- [ ] Debug logging disabled
- [ ] Crash reporting configured
- [ ] App icons at all sizes
- [ ] Splash screen configured
- [ ] All permissions documented
- [ ] Privacy policy URL ready
- [ ] Support URL/email ready

### Testing
- [ ] Tested on real device (iOS)
- [ ] Tested on real device (Android)
- [ ] All features work
- [ ] No crashes
- [ ] Handles offline mode
- [ ] Handles errors gracefully
- [ ] Camera permission works
- [ ] Photo library permission works

### Content
- [ ] Screenshots prepared (all sizes)
- [ ] App description written
- [ ] Keywords selected
- [ ] What's new / Release notes
- [ ] Privacy policy published
- [ ] Terms of service (if needed)

---

## Post-Submission

### After Approval
1. Monitor crash reports
2. Check user reviews
3. Respond to feedback
4. Plan updates based on usage

### Updating the App
1. Make changes
2. Increment version numbers
3. Build new version
4. Submit update
5. Wait for approval

---

## Resources

- **Expo Docs:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Play Store Guidelines:** https://play.google.com/console/about/guides/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/

---

**Next Steps:**
1. Complete checklist above
2. Run test builds
3. Prepare store assets
4. Submit for review
