# 🚀 BookMate Mobile - Deployment Guide

## Overview

This document provides comprehensive instructions for building and deploying the BookMate mobile application to both iOS and Android platforms using Expo Application Services (EAS).

---

## Prerequisites

### Required Tools
- Node.js 20.19.4 or higher
- npm 11.x or higher
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Git

### Required Accounts
- Expo account (https://expo.dev)
- Apple Developer account (for iOS)
- Google Play Console account (for Android)

---

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The application uses environment variables for API configuration. Create a `.env` file (never commit this):

```bash
EXPO_PUBLIC_API_BASE_URL=https://accounting.siamoon.com/api
```

For production builds, these are set in `eas.json` under each build profile.

---

## EAS Build Configuration

The project uses three build profiles defined in `eas.json`:

### 1. Development Profile
- **Purpose**: Internal testing and development
- **Distribution**: Internal
- **Output**: APK (Android), Development build (iOS)

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### 2. Preview Profile
- **Purpose**: Pre-production testing
- **Distribution**: Internal
- **Output**: APK (Android), Ad-hoc (iOS)

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### 3. Production Profile
- **Purpose**: App Store submission
- **Distribution**: Store
- **Output**: AAB (Android), App Store (iOS)

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

---

## Building for Production

### iOS Production Build

1. **Ensure Credentials are Set**
   ```bash
   eas credentials
   ```

2. **Start Production Build**
   ```bash
   eas build -p ios --profile production
   ```

3. **Monitor Build Progress**
   - View progress at: https://expo.dev/accounts/siamoon/projects/bookmate-mobile/builds
   - Build typically takes 10-15 minutes

4. **Download Build**
   - Once complete, download the `.ipa` file or submit directly to App Store

### Android Production Build

1. **Start Production Build**
   ```bash
   eas build -p android --profile production
   ```

2. **Monitor Build Progress**
   - View progress in Expo dashboard
   - Build typically takes 10-15 minutes

3. **Download Build**
   - Once complete, download the `.aab` file for Play Store submission

---

## App Store Submission

### iOS - TestFlight & App Store

1. **Submit to TestFlight**
   ```bash
   eas submit -p ios
   ```

2. **Manual Submission via Xcode**
   - Download the `.ipa` file
   - Open Xcode → Window → Organizer
   - Upload to App Store Connect

3. **App Store Connect Steps**
   - Log in to https://appstoreconnect.apple.com
   - Navigate to My Apps → BookMate
   - Fill in required metadata
   - Submit for review

### Android - Google Play

1. **Submit to Play Store**
   ```bash
   eas submit -p android
   ```

2. **Manual Submission**
   - Log in to https://play.google.com/console
   - Upload the `.aab` file
   - Fill in required metadata
   - Submit for review

---

## Build Configuration Details

### App Configuration (`app.json`)

```json
{
  "expo": {
    "name": "BookMate",
    "slug": "bookmate-mobile",
    "version": "1.0.1",
    "ios": {
      "bundleIdentifier": "com.siamoon.bookmate",
      "buildNumber": "2"
    },
    "android": {
      "package": "com.siamoon.bookmate",
      "versionCode": 2
    }
  }
}
```

### Build Properties

Configured via `expo-build-properties` plugin:

**iOS:**
- Deployment Target: iOS 15.1+
- Framework: Static frameworks
- Swift version: Latest

**Android:**
- Compile SDK: 34
- Target SDK: 34
- Build Tools: 34.0.0

---

## Version Management

### Incrementing Versions

**For Bug Fixes (Patch):**
- Update `version` in `app.json`: `1.0.1` → `1.0.2`
- Update `buildNumber` (iOS): `2` → `3`
- Update `versionCode` (Android): `2` → `3`

**For New Features (Minor):**
- Update `version`: `1.0.2` → `1.1.0`
- Reset build numbers: `1`

**For Major Changes:**
- Update `version`: `1.1.0` → `2.0.0`
- Reset build numbers: `1`

---

## Troubleshooting

### Common Build Issues

**1. Build Fails with "Bundle Identifier Mismatch"**
- Ensure `bundleIdentifier` in `app.json` matches Apple Developer Portal
- Run `eas credentials` to verify certificates

**2. Android Build Fails**
- Check that SDK versions are correctly set in build properties
- Verify Gradle configuration

**3. EAS Build Timeout**
- Increase resource class in `eas.json`
- Check for circular dependencies

**4. Environment Variables Not Working**
- Ensure variables are prefixed with `EXPO_PUBLIC_`
- Verify they're set in `eas.json` under the correct profile

### Logs and Debugging

**View Build Logs:**
```bash
eas build:list
eas build:view [BUILD_ID]
```

**Local Build Testing:**
```bash
eas build --platform ios --local
eas build --platform android --local
```

---

## CI/CD Integration

### GitHub Actions (Future)

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build
on:
  push:
    branches: [main]
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --non-interactive --platform all --profile production
```

---

## Security Best Practices

1. **Never commit sensitive data**
   - Use `.env` files (git-ignored)
   - Use Expo Secrets for sensitive values

2. **Rotate API keys regularly**
   - Update in `.env` and Expo dashboard

3. **Use environment-specific configs**
   - Development, Preview, Production profiles
   - Different API endpoints per environment

---

## Post-Deployment Checklist

- [ ] Verify app launches correctly
- [ ] Test all core features (camera, upload, sync)
- [ ] Verify API connectivity
- [ ] Check analytics/crash reporting setup
- [ ] Monitor App Store/Play Store reviews
- [ ] Update changelog and release notes

---

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Apple Developer**: https://developer.apple.com
- **Google Play Console**: https://play.google.com/console

---

**Last Updated**: November 11, 2025  
**App Version**: 1.0.1  
**Build Number**: 2
