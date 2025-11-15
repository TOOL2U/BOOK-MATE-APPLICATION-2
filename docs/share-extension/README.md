# 📚 iOS Share Extension — Planning Package Index

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Status:** 📋 Planning Complete  
**Last Updated:** November 12, 2025

---

## 🎯 Overview

This directory contains **comprehensive planning documentation** for the BookMate iOS Share Extension feature. All documents were created on **November 12, 2025** while v1.0 is in App Store review.

**Purpose:** Prepare for rapid v1.1+ implementation after v1.0 approval  
**Branch:** `feature/ios-share-extension-planning`

---

## 📑 Document Index

### 1. [PLAN.md](./PLAN.md) — Master Project Plan
**Purpose:** Overall project roadmap, timeline, risks, and go/no-go criteria

**Key Sections:**
- Problem statement & success metrics
- 9 identified risks with mitigations
- 5-phase timeline (Nov 12 → Dec 23, 2025)
- Performance targets (<800ms launch, <5s upload)
- Go/No-Go decision framework
- Stakeholder matrix

**Audience:** PM, Engineering Leads, Executives

---

### 2. [UX_FLOW.md](./UX_FLOW.md) — User Experience Flow
**Purpose:** Complete user journey, edge cases, wireframes, and testing scenarios

**Key Sections:**
- 5 user stories (single photo, multiple photos, PDF, banking app, offline)
- Detailed flow diagrams (happy path, errors, offline)
- UI wireframes (extension UI, success/error states)
- 7 edge cases with handling (large file, duplicate, token expired, etc.)
- Empty/error states
- App Store screenshot plan
- 3 user testing scenarios
- Acceptance criteria

**Audience:** Product Designer, PM, QA

---

### 3. [TECH_SPEC.md](./TECH_SPEC.md) — Technical Specification
**Purpose:** Architecture, iOS constraints, entitlements, and performance requirements

**Key Sections:**
- Architecture diagram (Extension → App Group → Host App → Backend)
- Xcode project structure (current vs target)
- Bundle IDs (`com.siamoon.bookmate.share`, `group.com.siamoon.bookmate`)
- Entitlements configuration
- File validation logic (MIME type, size, magic number)
- App Group file structure
- Performance constraints (120MB memory, 30s time limit)
- Security considerations (Keychain, PII handling)
- Expo migration path (Managed → Dev Client)

**Audience:** iOS Engineer, Platform Architect

---

### 4. [PARSING_STRATEGY.md](./PARSING_STRATEGY.md) — File Processing Strategy
**Purpose:** How files are named, stored, validated, and prepared for upload

**Key Sections:**
- File naming convention (`YYYYMMDD_HHMMSS_{uuid}.{ext}`)
- Metadata JSON schema (v1.0: minimal, v1.1: OCR)
- Image compression logic (>5MB compressed)
- PDF validation (magic number, not password-protected)
- App Group storage structure (`pending/`, `uploaded/`)
- Upload payload format (multipart/form-data)
- v1.1 enhancements (OCR, smart field detection, PDF text extraction)
- Cleanup strategy (purge after 7 days)

**Audience:** iOS Engineer, Backend Engineer

---

### 5. [API_CONTRACT.md](./API_CONTRACT.md) — Backend API Specification
**Purpose:** Complete API definition for file ingestion endpoint

**Key Sections:**
- Endpoint: `POST /api/mobile/ingest`
- Request format (multipart/form-data with metadata JSON)
- Success response (200 OK with ingestion ID)
- Error responses (400, 401, 413, 415, 429, 500, 503)
- Retry strategy (exponential backoff, 3 attempts)
- Backend implementation example (Node.js + Express)
- Database schema (`ingestions` table)
- Rate limiting (100 req/hour per user)
- Testing endpoints (staging, local development)

**Audience:** Backend Engineer, iOS Engineer

---

### 6. [QA_TEST_PLAN.md](./QA_TEST_PLAN.md) — Quality Assurance Test Plan
**Purpose:** Comprehensive test cases, device matrix, and acceptance criteria

**Key Sections:**
- Device matrix (7 devices: iPhone 12-15 Pro Max, iPad Air/Pro)
- 20 detailed test cases (TC-001 through TC-020)
  - Share single photo
  - Share multiple photos
  - Share PDF
  - Offline mode
  - Token expiration
  - Large files
  - Unsupported files
  - Network interruption
  - etc.
- Performance benchmarks (extension launch <800ms, upload <5s Wi-Fi)
- Security test cases (token storage, PII handling, malicious files)
- Screenshot test plan (5 iPhone + 5 iPad screenshots)
- Acceptance criteria (all P0 pass, ≥95% P1 pass)
- Bug severity levels (P0-P4)

**Audience:** QA Engineer, iOS Engineer

---

### 7. [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) — Security Review Checklist
**Purpose:** Comprehensive security requirements and validation

**Key Sections:**
- Authentication (Keychain storage, token validation)
- File validation (MIME type by content, magic number check)
- PII handling (temporary storage, purge after upload)
- Network security (HTTPS, TLS 1.3, certificate pinning)
- Access control (App Group permissions, file permissions)
- Logging (redact tokens, no PII in logs)
- Error handling (fail securely, generic user errors)
- Incident response plan (kill switch, escalation path)
- Pre-launch security checklist
- Sign-off form

**Audience:** Security Lead, iOS Engineer

---

### 8. [ROLLBACK_PLAN.md](./ROLLBACK_PLAN.md) — Incident Rollback Procedures
**Purpose:** How to disable or roll back feature if critical issues arise

**Key Sections:**
- Rollback triggers (P0: crashes, data loss; P1: <90% success rate)
- 3 rollback strategies:
  1. Remote config kill switch (<5 min)
  2. App update with extension removed (2-4 hours + App Review)
  3. Server-side upload rejection (<10 min)
- Rollback decision matrix
- Execution checklist (pre, during, post)
- Incident response team (on-call rotation)
- Monitoring alerts (crash rate, upload success, memory leak)
- Post-mortem template
- Communication templates (internal, user-facing, App Store)

**Audience:** iOS Lead, DevOps/SRE, PM

---

### 9. [REPO_SCOPING.md](./REPO_SCOPING.md) — Repository Migration Guide
**Purpose:** How to migrate from Expo Managed to Expo Prebuild (required for native extensions)

**Key Sections:**
- Current vs target repository structure
- 11-step migration process:
  1. Backup
  2. Install dependencies
  3. Convert app.json → app.config.js
  4. Create Expo config plugin
  5. Generate native projects (`npx expo prebuild`)
  6. Update .gitignore (track ios/, android/)
  7. Add Swift files manually
  8. Configure extension target
  9. Update EAS build config
  10. Build with EAS
  11. Commit changes
- File changes summary (new, modified, deleted)
- Testing after migration
- Migration risks & mitigations
- Developer documentation (README updates)

**Audience:** iOS Engineer, Platform Architect, DevOps

---

### 10. [HOST_HANDOFF.md](./HOST_HANDOFF.md) — Host App Queue Processing
**Purpose:** How main app discovers, uploads, and manages files from share extension

**Key Sections:**
- Architecture (Share Extension → App Group → Host App → Backend)
- 6 host app responsibilities:
  1. Monitor App Group inbox (on foreground)
  2. Discover pending files
  3. Upload queue management
  4. Upload service (multipart/form-data)
  5. Move to uploaded archive
  6. Show notifications
- Pending uploads screen (UI design + React Native code)
- Background upload (iOS Background Tasks)
- Cleanup job (delete files >7 days)
- Complete Swift & TypeScript code examples

**Audience:** iOS Engineer, React Native Engineer

---

### 11. [APP_STORE_ITEMS.md](./APP_STORE_ITEMS.md) — Apple Portal & App Store Metadata
**Purpose:** Checklist of all Apple Developer and App Store Connect items

**Key Sections:**
- 8 Apple Developer Portal items:
  1. App Group: `group.com.siamoon.bookmate`
  2. Share Extension Bundle ID: `com.siamoon.bookmate.share`
  3. Update main app identifier (enable App Groups)
  4. Regenerate main app provisioning profile
  5. Create extension provisioning profile
  6. Distribution certificate (reuse existing)
- 5 App Store Connect items:
  1. Version 1.1.0 metadata update
  2. "What's New" text
  3. Screenshots (add share sheet + extension UI)
  4. App Privacy update (add "User Content")
  5. App Review notes (demo account + testing instructions)
- Post-approval actions (Day 1, Week 1, Week 2)
- Success metrics to track (40% adoption, ≥99% upload success)

**Audience:** iOS Engineer, PM

---

### 12. [ANALYTICS_EVENTS.md](./ANALYTICS_EVENTS.md) — Telemetry & Metrics
**Purpose:** All analytics events and performance metrics to track

**Key Sections:**
- 11 event definitions:
  1. `share_extension_opened`
  2. `share_item_validated`
  3. `share_item_saved`
  4. `share_confirmed`
  5. `share_cancelled`
  6. `share_upload_started`
  7. `share_upload_success`
  8. `share_upload_failed`
  9. `share_queue_persisted`
  10. `share_queue_flushed`
  11. `share_error`
- 3 performance metrics (extension launch, file save, upload)
- 4 user engagement metrics (DAU, adoption rate, success rate, upload time)
- Dashboard panels (Grafana/Datadog visualizations)
- 4 alerts (high error rate, low success rate, slow performance, backend errors)
- Implementation checklist (Swift, React Native, Backend)

**Audience:** iOS Engineer, Data Analyst, Backend Engineer

---

## 📊 Quick Reference

### Timeline
```
Phase 1: Planning             Nov 12-18, 2025  ✅ COMPLETE
Phase 2: Development          Nov 19-Dec 2     ⏸️ Pending
Phase 3: QA Testing           Dec 3-9          ⏸️ Pending
Phase 4: TestFlight Beta      Dec 10-16        ⏸️ Pending
Phase 5: Production Release   Dec 23           ⏸️ Pending
```

### Key Deliverables
- ✅ 12 comprehensive planning documents (45,000+ words total)
- ✅ Complete UX wireframes and user flows
- ✅ Full technical architecture
- ✅ Ready-to-implement code examples (Swift + TypeScript)
- ✅ API contract with backend team
- ✅ QA test plan with 20+ test cases
- ✅ Security checklist and rollback procedures
- ✅ Analytics events and monitoring plan

### Success Metrics
- **Adoption:** 40% of users use share extension within 30 days
- **Performance:** Extension launches <800ms, uploads <5s on Wi-Fi
- **Reliability:** ≥99% upload success rate
- **User Satisfaction:** +10 NPS points

### Dependencies
- ✅ v1.0 App Store approval (in review)
- ⏸️ Backend API endpoint (`POST /api/mobile/ingest`) — needs implementation
- ⏸️ Apple Developer Portal setup (App Group, Bundle IDs)
- ⏸️ Expo Managed → Prebuild migration

---

## 🚀 Next Steps

### Immediate (After v1.0 Approval)
1. **Backend Team:** Implement `POST /api/mobile/ingest` endpoint (see API_CONTRACT.md)
2. **iOS Team:** Set up Apple Developer Portal items (see APP_STORE_ITEMS.md)
3. **PM:** Finalize v1.1 timeline and assign resources

### Phase 2: Development (Week 1)
1. Migrate to Expo Prebuild (see REPO_SCOPING.md)
2. Create ShareExtension target in Xcode
3. Implement Swift extension code
4. Set up App Group communication
5. Implement host app queue processing

### Phase 2: Development (Week 2)
1. Complete upload service implementation
2. Add pending uploads screen UI
3. Implement background upload
4. Add analytics instrumentation
5. Write unit tests

### Phase 3: QA (Week 1)
1. Execute all test cases from QA_TEST_PLAN.md
2. Security review per SECURITY_CHECKLIST.md
3. Performance testing (meet benchmarks)
4. Bug fixes

### Phase 4: TestFlight Beta
1. Build with EAS (`eas build --profile production`)
2. Submit to TestFlight
3. Internal testing (team + beta users)
4. Collect feedback, iterate if needed

### Phase 5: Production
1. Submit to App Store for review
2. Monitor review status
3. After approval: Release v1.1.0
4. Monitor metrics (adoption, success rate, performance)
5. Post-launch support (respond to issues within 4 hours)

---

## 📁 File Structure

```
docs/share-extension/
├── README.md                    ← This file
├── PLAN.md                      ← Master project plan
├── UX_FLOW.md                   ← User experience & wireframes
├── TECH_SPEC.md                 ← Technical architecture
├── PARSING_STRATEGY.md          ← File processing logic
├── API_CONTRACT.md              ← Backend API specification
├── QA_TEST_PLAN.md              ← Test cases & acceptance criteria
├── SECURITY_CHECKLIST.md        ← Security requirements
├── ROLLBACK_PLAN.md             ← Incident response procedures
├── REPO_SCOPING.md              ← Repository migration guide
├── HOST_HANDOFF.md              ← Host app queue processing
├── APP_STORE_ITEMS.md           ← Apple portal checklist
└── ANALYTICS_EVENTS.md          ← Telemetry & metrics
```

---

## ✅ Planning Completion Checklist

- [x] Master project plan created (PLAN.md)
- [x] User flows and wireframes documented (UX_FLOW.md)
- [x] Technical architecture designed (TECH_SPEC.md)
- [x] File processing strategy defined (PARSING_STRATEGY.md)
- [x] API contract written (API_CONTRACT.md)
- [x] QA test plan prepared (QA_TEST_PLAN.md)
- [x] Security checklist completed (SECURITY_CHECKLIST.md)
- [x] Rollback procedures documented (ROLLBACK_PLAN.md)
- [x] Repository migration guide created (REPO_SCOPING.md)
- [x] Host app handoff specified (HOST_HANDOFF.md)
- [x] App Store items listed (APP_STORE_ITEMS.md)
- [x] Analytics events defined (ANALYTICS_EVENTS.md)
- [ ] **Review & approval from PM** (Pending)
- [ ] **Review & approval from iOS Lead** (Pending)
- [ ] **Review & approval from Backend Lead** (Pending)
- [ ] **Review & approval from Security Team** (Pending)

---

## 👥 Document Ownership

| Document              | Primary Owner    | Reviewers                     |
|-----------------------|------------------|-------------------------------|
| PLAN.md               | PM               | iOS Lead, CTO                 |
| UX_FLOW.md            | Product Designer | PM, iOS Lead                  |
| TECH_SPEC.md          | iOS Lead         | Platform Architect, DevOps    |
| PARSING_STRATEGY.md   | iOS Lead         | Backend Lead                  |
| API_CONTRACT.md       | Backend Lead     | iOS Lead, API Team            |
| QA_TEST_PLAN.md       | QA Lead          | iOS Lead, PM                  |
| SECURITY_CHECKLIST.md | Security Lead    | iOS Lead, CTO                 |
| ROLLBACK_PLAN.md      | SRE/DevOps       | iOS Lead, PM                  |
| REPO_SCOPING.md       | Platform Arch    | iOS Lead, DevOps              |
| HOST_HANDOFF.md       | iOS Lead         | React Native Lead             |
| APP_STORE_ITEMS.md    | iOS Lead         | PM                            |
| ANALYTICS_EVENTS.md   | Data Analyst     | iOS Lead, Backend Lead        |

---

## 📞 Contact & Support

**Questions about this planning package?**
- **iOS Lead:** Shaun Ducker (shaun@siamoon.com)
- **PM:** TBD
- **Slack:** #bookmate-ios-share-extension

**Found an issue in the docs?**
- Create PR with fix
- Tag @ios-lead for review

---

## 📜 Version History

| Version | Date           | Changes                                      |
|---------|----------------|----------------------------------------------|
| 1.0     | Nov 12, 2025   | Initial planning package created (all docs) |

---

**Planning Status:** ✅ **COMPLETE**  
**Ready for:** Review & Approval  
**Next Milestone:** v1.0 App Store approval + Development kickoff

---

*Last Updated: November 12, 2025*  
*Planning Package Owner: iOS Lead (Shaun Ducker)*  
*Branch: `feature/ios-share-extension-planning`*
