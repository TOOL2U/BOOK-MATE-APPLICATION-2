# 🚀 BookMate Mobile - Ready to Deploy Commands

**Last Updated**: November 11, 2025  
**Version**: 1.0.1  
**Build**: 2  
**Status**: ✅ PRODUCTION READY

---

## 📝 Pre-Deployment Checklist

Before running commands, verify:
- [x] Repository is clean and organized
- [x] All packages updated to SDK 54
- [x] No secrets in codebase
- [x] app.json configuration verified
- [x] eas.json profiles configured
- [x] Documentation complete

**Status**: ✅ All checks passed - Ready to proceed

---

## 1️⃣ Git Commit & Tag (REQUIRED FIRST)

### Commit Changes
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Phase 4 Complete: Repository optimization for App Store submission"

# Create version tag
git tag -a v1.0.1-appstore -m "BookMate iOS App Store Release v1.0.1 Build 2"

# Push to remote
git push origin main --tags
```

**Expected Result**: 
- ✅ All changes committed
- ✅ Tag `v1.0.1-appstore` created
- ✅ Changes pushed to GitHub

---

## 2️⃣ Production Builds (EAS Build)

### iOS Production Build

```bash
# Build for App Store
eas build -p ios --profile production
```

**What happens**:
- Expo uploads code to build servers
- iOS app compiled with production settings
- Generates .ipa file for App Store
- Build time: ~10-15 minutes

**Expected Output**:
```
✔ Build complete!
Build ID: [BUILD_ID]
App Store URL: [URL]
```

### Android Production Build

```bash
# Build for Play Store
eas build -p android --profile production
```

**What happens**:
- Expo uploads code to build servers
- Android app bundle (.aab) created
- Optimized for Play Store
- Build time: ~10-15 minutes

**Expected Output**:
```
✔ Build complete!
Build ID: [BUILD_ID]
Play Store URL: [URL]
```

### Build Both Platforms at Once

```bash
# Build iOS and Android simultaneously
eas build --platform all --profile production
```

---

## 3️⃣ App Store Submission

### iOS - TestFlight & App Store

```bash
# Submit to App Store Connect
eas submit -p ios
```

**Required**:
- Apple Developer account
- App Store Connect access
- Build completed successfully

**What happens**:
1. Prompts for Apple ID credentials
2. Uploads .ipa to App Store Connect
3. Creates TestFlight build
4. Ready for internal testing

**Manual Steps After**:
1. Log in to https://appstoreconnect.apple.com
2. Navigate to TestFlight
3. Add internal testers
4. Submit for review when ready

### Android - Google Play

```bash
# Submit to Play Console
eas submit -p android
```

**Required**:
- Google Play Developer account
- Play Console access
- Build completed successfully

**What happens**:
1. Prompts for Play Console credentials
2. Uploads .aab to Play Console
3. Creates internal test track
4. Ready for testing

**Manual Steps After**:
1. Log in to https://play.google.com/console
2. Navigate to Internal Testing
3. Add testers
4. Submit for review when ready

---

## 4️⃣ Monitoring & Verification

### Check Build Status

```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# View build logs
eas build:view [BUILD_ID] --log
```

### Check Submission Status

```bash
# iOS submission status
eas submit:list -p ios

# Android submission status
eas submit:list -p android
```

---

## 5️⃣ Development Builds (Optional)

### For Testing Before Production

```bash
# Preview build (internal distribution)
eas build -p ios --profile preview
eas build -p android --profile preview

# Development build (for debugging)
eas build -p ios --profile development
eas build -p android --profile development
```

---

## 🔧 Troubleshooting Commands

### Clear Build Cache

```bash
# Clear EAS build cache
eas build:cancel

# Clear local Expo cache
npm start -- --clear
```

### Reinstall Dependencies

```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Verify Configuration

```bash
# Check for issues
npx expo-doctor

# Verify package versions
npx expo install --check
```

### Local Build (Testing)

```bash
# Build locally (requires Xcode/Android Studio)
eas build -p ios --profile production --local
eas build -p android --profile production --local
```

---

## 📱 Post-Deployment

### Update Version for Next Release

When ready for next version (e.g., 1.0.2):

```bash
# 1. Update version in app.json
# Change version to 1.0.2
# Increment buildNumber to 3 (iOS)
# Increment versionCode to 3 (Android)

# 2. Commit changes
git add app.json
git commit -m "Bump version to 1.0.2"
git tag -a v1.0.2 -m "Version 1.0.2"
git push origin main --tags
```

---

## 📊 Command Sequence Summary

**Complete Deployment Flow**:

```bash
# 1. Commit & Tag
git add .
git commit -m "Phase 4 Complete"
git tag -a v1.0.1-appstore -m "App Store Release"
git push origin main --tags

# 2. Build
eas build --platform all --profile production

# 3. Wait for builds to complete (~20-30 min)

# 4. Submit
eas submit -p ios
eas submit -p android

# 5. Verify submissions
eas submit:list
```

**Total Time**: ~45 minutes from start to App Store submission

---

## ✅ Success Indicators

After running commands, you should see:

**Git**:
- ✅ Commit SHA displayed
- ✅ Tag pushed successfully
- ✅ Branch up to date

**Builds**:
- ✅ "Build complete!" message
- ✅ Build URLs provided
- ✅ No error messages

**Submissions**:
- ✅ "Submission complete!" message
- ✅ App Store/Play Console shows new build
- ✅ TestFlight/Internal test track active

---

## 🆘 Support

If you encounter issues:

1. **Check build logs**: `eas build:view [BUILD_ID] --log`
2. **Review documentation**: See DEPLOYMENT.md
3. **Verify credentials**: Apple ID, Google Play account
4. **Check configuration**: app.json, eas.json

---

## 📚 Additional Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console

---

**Ready to deploy! Copy and paste commands as needed.** 🚀

**Last Verified**: November 11, 2025  
**App Version**: 1.0.1  
**Build Number**: 2
