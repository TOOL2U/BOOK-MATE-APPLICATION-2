# Changelog

All notable changes to the BookMate Mobile Application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2025-11-11

### Added
- Production build configuration with `expo-build-properties`
- Enhanced .gitignore for better secret management
- Comprehensive deployment documentation
- Repository cleanup and organization

### Changed
- Updated iOS deployment target to 15.1 (minimum requirement)
- Optimized asset bundle patterns to reduce build size
- Updated all package versions to match Expo SDK 54
- Organized documentation into structured folders

### Fixed
- Removed `@types/react-native` (types included in react-native)
- Fixed package version mismatches
- Corrected Android adaptive icon configuration

### Removed
- .DS_Store files from repository
- Deprecated documentation files (moved to archive)

---

## [1.0.0] - 2025-10-30

### Phase 3: App Store Preparation

#### Added
- Custom app icon with Sia Moon branding
- Branded splash screen
- iOS-specific build configuration
- App Store metadata and descriptions
- Screenshot capture functionality
- Privacy policy

#### Features
- **Upload Screen**: Camera and gallery support for receipt capture
- **OCR Integration**: Text extraction from receipt images
- **AI Extraction**: Automated field extraction using AI
- **Manual Entry**: 10-field transaction form
- **Balance Tracking**: Bank and cash balance management
- **P&L Dashboard**: Monthly and yearly financial KPIs
- **Inbox**: Transaction history with CRUD operations

#### Technical
- React Native via Expo SDK 54
- TypeScript for type safety
- React Navigation 7 for routing
- NativeWind (Tailwind CSS) for styling
- Axios for HTTP client
- Lottie animations for UI feedback

---

## [0.9.0] - 2025-10-25

### Phase 2: Core Features Implementation

#### Added
- Dropdown pickers for Property, Category, Payment Type
- Professional icon library (replaced emoji icons)
- Review screen for extracted receipt data
- Pull-to-refresh functionality
- Error handling and retry logic

#### Changed
- Improved UI/UX with consistent design system
- Enhanced form validation
- Better loading states and feedback

---

## [0.5.0] - 2025-10-20

### Phase 1: MVP Development

#### Added
- Initial project setup with Expo
- Navigation structure (5 tabs)
- API service layer with retry logic
- Basic upload functionality
- Manual entry form
- Balance view
- P&L dashboard
- Inbox/History view

#### Technical Stack
- React Native 0.81.5
- Expo SDK 54
- TypeScript 5.9.3
- React Navigation 7.x
- NativeWind 4.2.1

---

## Version History Summary

| Version | Date | Description |
|---------|------|-------------|
| 1.0.1 | Nov 11, 2025 | Repository optimization & production readiness |
| 1.0.0 | Oct 30, 2025 | App Store preparation complete |
| 0.9.0 | Oct 25, 2025 | Core features implementation |
| 0.5.0 | Oct 20, 2025 | MVP development |

---

## Upcoming Features (Roadmap)

### v1.1.0 (Planned)
- [ ] Offline support with local caching
- [ ] Push notifications for receipt processing status
- [ ] Biometric authentication (Face ID / Touch ID)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

### v1.2.0 (Planned)
- [ ] Export reports to PDF/Excel
- [ ] Receipt sharing functionality
- [ ] Advanced filtering and search
- [ ] Budget tracking and alerts
- [ ] Recurring transaction support

### v2.0.0 (Future)
- [ ] Web dashboard sync
- [ ] Multi-user support
- [ ] Advanced analytics and insights
- [ ] Receipt categorization AI improvements
- [ ] Integration with accounting software

---

**Maintained by**: Sia Moon  
**Repository**: https://github.com/TOOL2U/BOOK-MATE-APPLICATION-2  
**Last Updated**: November 11, 2025
