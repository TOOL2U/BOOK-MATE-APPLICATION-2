# 📦 iOS Share Extension — Repository Scoping

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Repository Impact Overview

**Current Architecture:** Expo Managed Workflow  
**Target Architecture:** EAS + Development Client (Expo Prebuild)

**Why Change?**  
Expo Managed Workflow does NOT support native iOS extensions (Share Extension, Widget Extension, etc.). Must migrate to Expo Prebuild (formerly "bare workflow") to add native extension targets.

---

## 📂 Current Repository Structure

```
BOOK-MATE-APPLICATION-2/
├── .git/
├── .gitignore
├── node_modules/
├── package.json
├── package-lock.json
├── app.json                    ← Expo config
├── App.tsx                     ← Root component
├── babel.config.js
├── metro.config.js
├── eas.json                    ← EAS Build config
├── tsconfig.json
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── ExpensesScreen.tsx
│   │   └── ...
│   ├── components/
│   │   ├── Button.tsx
│   │   └── ...
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   └── types/
│       └── ...
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── ...
├── ios/                         ← Auto-generated (ignored in .gitignore)
│   └── ...
└── android/                     ← Auto-generated (ignored in .gitignore)
    └── ...
```

---

## 📂 Target Repository Structure (After Migration)

```
BOOK-MATE-APPLICATION-2/
├── .git/
├── .gitignore                   ← Updated (track ios/ and android/)
├── node_modules/
├── package.json                 ← Updated dependencies
├── package-lock.json
├── app.config.js                ← NEW: Dynamic Expo config (replaces app.json)
├── App.tsx
├── babel.config.js
├── metro.config.js
├── eas.json                     ← Updated build profiles
├── tsconfig.json
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── ExpensesScreen.tsx
│   │   ├── PendingUploadsScreen.tsx   ← NEW: Share extension queue UI
│   │   └── ...
│   ├── components/
│   │   ├── Button.tsx
│   │   └── ...
│   ├── navigation/
│   │   └── AppNavigator.tsx            ← Updated routes
│   ├── services/
│   │   ├── api.ts
│   │   ├── AppGroupService.ts          ← NEW: Read App Group files
│   │   ├── UploadService.ts            ← NEW: Background upload
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   └── types/
│       └── ...
├── extensions/                          ← NEW: Extension code
│   └── share/
│       ├── ShareViewController.swift    ← NEW: Extension logic
│       ├── ShareViewController.storyboard (optional)
│       ├── ShareViewModel.swift         ← NEW: Business logic
│       └── Info.plist                   ← NEW: Extension config
├── plugins/                             ← NEW: Expo config plugins
│   └── withShareExtension.js            ← NEW: Auto-configure Xcode
├── ios/                                 ← NOW TRACKED IN GIT
│   ├── BookMate/                        ← Main app target
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   ├── BookMate.entitlements
│   │   ├── Images.xcassets/
│   │   └── ...
│   ├── ShareExtension/                  ← NEW: Extension target
│   │   ├── ShareViewController.swift
│   │   ├── ShareViewController.storyboard
│   │   ├── Info.plist
│   │   ├── ShareExtension.entitlements
│   │   └── Assets.xcassets/
│   ├── Pods/                            ← CocoaPods dependencies (if used)
│   ├── Podfile                          ← CocoaPods config (if used)
│   ├── Podfile.lock
│   ├── BookMate.xcodeproj/
│   └── BookMate.xcworkspace/            ← Open this in Xcode
├── android/                             ← NOW TRACKED IN GIT
│   └── ...
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── ...
└── docs/
    ├── share-extension/
    │   ├── PLAN.md
    │   ├── UX_FLOW.md
    │   ├── TECH_SPEC.md
    │   └── ...
    └── ...
```

---

## 🔄 Migration Steps

### Step 1: Backup Current State
```bash
# Create backup branch
git checkout -b backup/pre-expo-prebuild
git push origin backup/pre-expo-prebuild

# Tag current version
git tag v1.0-managed-workflow
git push --tags
```

---

### Step 2: Install Required Dependencies
```bash
# Update Expo CLI
npm install -g expo-cli eas-cli

# Install new dependencies
npm install --save expo-dev-client
npm install --save @react-native-community/netinfo  # For offline detection
npm install --save expo-file-system  # For App Group access
npm install --save expo-notifications  # For upload notifications

# Install dev dependencies
npm install --save-dev @expo/config-plugins
```

---

### Step 3: Convert app.json → app.config.js
```bash
# Rename
mv app.json app.config.js

# Update to export dynamic config
```

**app.config.js:**
```javascript
export default {
  expo: {
    name: "BookMate",
    slug: "bookmate",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.siamoon.bookmate",
      buildNumber: "3",
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Access photos to upload receipts"
      },
      entitlements: {
        "com.apple.security.application-groups": [
          "group.com.siamoon.bookmate"
        ]
      },
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.siamoon.bookmate"
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "14.0"
          }
        }
      ],
      "./plugins/withShareExtension"  // NEW: Share extension config plugin
    ],
    extra: {
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  }
};
```

---

### Step 4: Create Expo Config Plugin
**plugins/withShareExtension.js:**
```javascript
const {
  withXcodeProject,
  withEntitlementsPlist,
  withInfoPlist
} = require('@expo/config-plugins');

/**
 * Adds iOS Share Extension target to Xcode project
 */
function withShareExtension(config) {
  // Add extension target to Xcode
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    
    // Note: This is simplified. Actual implementation requires:
    // 1. Adding extension target
    // 2. Configuring build settings
    // 3. Adding source files
    // 4. Configuring entitlements
    
    // For production, use existing plugin or custom implementation
    // See: https://github.com/expo/config-plugins
    
    return config;
  });
  
  // Add App Group entitlement to main app
  config = withEntitlementsPlist(config, (config) => {
    if (!config.modResults['com.apple.security.application-groups']) {
      config.modResults['com.apple.security.application-groups'] = [];
    }
    
    if (!config.modResults['com.apple.security.application-groups'].includes('group.com.siamoon.bookmate')) {
      config.modResults['com.apple.security.application-groups'].push('group.com.siamoon.bookmate');
    }
    
    return config;
  });
  
  return config;
}

module.exports = withShareExtension;
```

---

### Step 5: Generate Native Projects
```bash
# Clean previous builds
rm -rf ios/ android/ node_modules/

# Reinstall dependencies
npm install

# Generate native projects
npx expo prebuild --clean

# Result:
# - ios/ folder created with Xcode project
# - android/ folder created with Android Studio project
# - Both are now part of source control
```

---

### Step 6: Update .gitignore
```bash
# Edit .gitignore - REMOVE these lines:
# ios/       ← NOW TRACKED
# android/   ← NOW TRACKED

# ADD these lines:
ios/Pods/
ios/build/
ios/*.xcworkspace/xcuserdata/
android/build/
android/.gradle/
```

---

### Step 7: Add Swift Files Manually
```bash
# Open Xcode
open ios/BookMate.xcworkspace

# In Xcode:
# 1. Right-click BookMate project → Add Target → Share Extension
# 2. Product Name: ShareExtension
# 3. Language: Swift
# 4. Bundle ID: com.siamoon.bookmate.share
# 5. Add files from extensions/share/ to ShareExtension target
```

**Or copy files manually:**
```bash
# Copy extension files
cp -r extensions/share/* ios/ShareExtension/

# Update Xcode project (add file references)
# This requires Xcode GUI or programmatic Xcode project manipulation
```

---

### Step 8: Configure Extension Target
**ios/ShareExtension/Info.plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>BookMate</string>
    
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionAttributes</key>
        <dict>
            <key>NSExtensionActivationRule</key>
            <dict>
                <key>NSExtensionActivationSupportsFileWithMaxCount</key>
                <integer>10</integer>
                <key>NSExtensionActivationSupportsImageWithMaxCount</key>
                <integer>10</integer>
            </dict>
        </dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.share-services</string>
        <key>NSExtensionPrincipalClass</key>
        <string>ShareViewController</string>
    </dict>
</dict>
</plist>
```

**ios/ShareExtension/ShareExtension.entitlements:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.siamoon.bookmate</string>
    </array>
</dict>
</plist>
```

---

### Step 9: Update EAS Build Configuration
**eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "shaun@siamoon.com",
        "ascAppId": "6755171461",
        "appleTeamId": "Z3X867AM26"
      }
    }
  }
}
```

---

### Step 10: Build with EAS
```bash
# Development build (for local testing)
eas build --profile development --platform ios

# Production build (for App Store)
eas build --profile production --platform ios
```

---

### Step 11: Commit Changes
```bash
# Stage all changes
git add .

# Commit
git commit -m "feat: Migrate to Expo Prebuild + Add Share Extension

- Convert app.json to app.config.js
- Add Expo config plugin for Share Extension
- Generate native iOS/Android projects (now tracked)
- Add ShareExtension target with Swift code
- Configure App Group entitlements
- Update EAS build profiles for dev client

BREAKING CHANGE: Requires Expo Prebuild (no longer Managed Workflow)"

# Push
git push origin feature/ios-share-extension-planning
```

---

## 📊 File Changes Summary

### New Files (Tracked in Git)
```
app.config.js
plugins/withShareExtension.js
extensions/share/ShareViewController.swift
extensions/share/ShareViewModel.swift
ios/ (entire directory)
android/ (entire directory)
src/screens/PendingUploadsScreen.tsx
src/services/AppGroupService.ts
src/services/UploadService.ts
```

### Modified Files
```
.gitignore (remove ios/, android/ exclusions)
package.json (add expo-dev-client, expo-file-system, etc.)
eas.json (add developmentClient: true)
src/navigation/AppNavigator.tsx (add new routes)
```

### Deleted Files
```
app.json (replaced by app.config.js)
```

---

## 🧪 Testing After Migration

### Local Development
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# iOS development build (already built with EAS)
# Download .tar.gz from EAS build page
# Drag to iOS Simulator

# Or build locally (requires Xcode)
npx expo run:ios
```

### Verify Extension Works
```bash
# 1. Build app with extension
npx expo run:ios --device

# 2. Test share sheet
# - Open Photos app on device
# - Share photo
# - Verify "BookMate" appears
# - Tap "BookMate"
# - Verify extension opens

# 3. Verify file saved to App Group
# Xcode → Window → Devices and Simulators
# → Select device → BookMate → Download Container
# → Inspect: AppData/AppGroup/group.com.siamoon.bookmate/pending/
```

---

## 🚨 Migration Risks & Mitigations

### Risk 1: Breaking Existing Builds
**Mitigation:**
- Keep backup branch (`backup/pre-expo-prebuild`)
- Test extensively in staging before merging
- Create v1.0.1 hotfix release (without extension) as fallback

---

### Risk 2: Xcode Project Conflicts
**Mitigation:**
- Use `npx expo prebuild --clean` to regenerate projects
- Document manual Xcode changes (entitlements, targets)
- Consider using `pod install` automation

---

### Risk 3: Team Onboarding (Other Developers)
**Mitigation:**
- Update README with new setup instructions
- Create video walkthrough of migration
- Document common issues and fixes

---

### Risk 4: Build Time Increase
**Impact:** Managed Workflow builds faster (cloud-only)  
**New Build Time:** ~15-20 min (EAS) vs ~10 min (Managed)

**Mitigation:**
- Use development builds for local testing (faster iteration)
- Only build production on release

---

## 📖 Developer Documentation

### Setup Guide (README.md Addition)
```markdown
## Setup (After Expo Prebuild Migration)

### Prerequisites
- Node.js 18+
- Xcode 15+ (for iOS development)
- EAS CLI: `npm install -g eas-cli`

### Installation
```bash
# Clone repo
git clone https://github.com/siamoon/bookmate-mobile.git
cd bookmate-mobile

# Install dependencies
npm install

# iOS: Install pods
cd ios
pod install
cd ..
```

### Running App
```bash
# Start Metro bundler
npm start

# iOS (Simulator)
npm run ios

# iOS (Device - requires dev build)
# 1. Download dev build from EAS
# 2. Install on device
# 3. Scan QR code from Metro bundler
```

### Building for Production
```bash
# Build with EAS
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```
```

---

## ✅ Migration Checklist

### Pre-Migration
- [ ] Backup current main branch
- [ ] Create migration feature branch
- [ ] Review all pending PRs (merge or postpone)
- [ ] Notify team of migration timeline

### Migration
- [ ] Convert app.json → app.config.js
- [ ] Create Expo config plugin
- [ ] Run `npx expo prebuild --clean`
- [ ] Add Swift extension files
- [ ] Configure entitlements
- [ ] Update .gitignore
- [ ] Update EAS build profiles
- [ ] Test local build (`npx expo run:ios`)
- [ ] Test EAS build
- [ ] Test extension functionality

### Post-Migration
- [ ] Update README with new setup instructions
- [ ] Document Xcode project structure
- [ ] Update CI/CD pipelines (if any)
- [ ] Train team on new workflow
- [ ] Merge to main after QA approval

---

**Status:** ✅ Repository Scoping Complete  
**Next:** Host app handoff queue processing  
**Review:** Pending iOS Lead and DevOps approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + Platform Architect*
