# 📦 iOS Share Extension — Project Plan

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Status:** Planning Phase  
**Branch:** `feature/ios-share-extension-planning`  
**Last Updated:** November 12, 2025

---

## 🎯 Problem Statement

**Current State:**
Users must manually open the BookMate app, navigate to the receipt upload screen, and select files from their photo library. This creates friction in the bookkeeping workflow.

**Pain Points:**
- 5+ steps to upload a receipt (Open app → Navigate → Upload → Select → Confirm)
- Can't share directly from banking apps or Files app
- Disrupts natural mobile workflow (receive bank slip → share → done)
- Higher abandonment rate for receipt capture

**Desired State:**
Users can share bank slips, receipts, and PDFs directly to BookMate from iOS share sheet with 2-3 taps, regardless of source app (Photos, Files, Banking apps, Email, etc.).

---

## 🎯 Outcomes & Success Metrics

### Primary Outcomes
1. **Reduce Time-to-Ingest** - From receipt received to uploaded < 10 seconds
2. **Increase Upload Volume** - 30%+ increase in receipts uploaded per user per month
3. **Improve User Satisfaction** - NPS +10 points for "ease of receipt upload"

### Success Metrics

#### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to open share UI | < 800ms | p95 from share tap to extension visible |
| Single photo upload (Wi-Fi) | < 5s | End-to-end including backend confirmation |
| Single photo upload (4G) | < 15s | End-to-end including backend confirmation |
| Upload success rate | ≥ 99% | Successful uploads / total attempts |
| Extension memory usage | < 100MB | Peak memory during processing |
| Offline queue persistence | 100% | Files survive app kill/reboot |

#### User Adoption Targets
| Metric | Target | Timeline |
|--------|--------|----------|
| Share extension usage | 40% of active users | Within 30 days of launch |
| Receipts via share sheet | 60% of total uploads | Within 60 days |
| Share-to-upload completion | ≥ 85% | From share tap to successful upload |

#### Technical Reliability
| Metric | Target |
|--------|--------|
| Extension crash rate | < 0.1% |
| Host app crash on handoff | < 0.05% |
| Failed upload retry success | ≥ 90% |
| Queue processing latency | < 2s after app foreground |

---

## ⚠️ Risks & Mitigations

### 1. App Review Delays
**Risk:** Adding extension target may trigger extended review (7-14 days vs 1-3 days)

**Likelihood:** Medium  
**Impact:** High (delays v1.1 launch)

**Mitigation:**
- Submit v1.1 with clear release notes explaining share extension
- Provide demo video showing extension functionality
- Include comprehensive privacy disclosures (no new data collected)
- Pre-approve entitlements with Apple Developer Support

**Owner:** Mobile Lead  
**Status:** Documented

---

### 2. Entitlement Changes
**Risk:** App Group entitlement requires App Store Connect configuration changes

**Likelihood:** High  
**Impact:** Medium

**Mitigation:**
- Document all required identifiers and entitlements
- Create App Group ID immediately after v1.0 approval
- Test provisioning profile updates on TestFlight before production
- Maintain rollback plan if entitlements cause signing issues

**Owner:** iOS Lead  
**Status:** Planned in APP_STORE_ITEMS.md

---

### 3. Background Upload Reliability
**Risk:** Extension may be killed before upload completes; files lost

**Likelihood:** Medium  
**Impact:** High (user trust)

**Mitigation:**
- Persist files to App Group container immediately
- Host app queues and retries failed uploads on next foreground
- User sees "Upload pending" state in host app
- Telemetry tracks queue depth and retry success rate
- Background upload task (URLSession) for large files

**Owner:** Mobile Lead  
**Status:** Documented in TECH_SPEC.md

---

### 4. Extension Memory Limits
**Risk:** iOS may terminate extension if memory exceeds ~120MB

**Likelihood:** Medium (with large HEIC files)  
**Impact:** Medium

**Mitigation:**
- Compress images >12MP before upload
- Stream large PDFs instead of loading into memory
- Monitor memory usage with Instruments
- Graceful degradation: if compression fails, queue for host app upload
- Set hard limit: reject files >50MB at extension level

**Owner:** iOS Lead  
**Status:** Implementation detail in TECH_SPEC.md

---

### 5. Network Unavailability
**Risk:** User shares while offline; extension can't upload

**Likelihood:** High  
**Impact:** Low (expected behavior)

**Mitigation:**
- Immediate persistence to App Group container
- Host app displays "X pending uploads" on next launch
- Background sync when network available
- User-visible queue with manual retry option

**Owner:** Mobile Lead  
**Status:** Covered in HOST_HANDOFF.md

---

### 6. User Not Authenticated
**Risk:** Extension opened but user logged out in host app

**Likelihood:** Low  
**Impact:** Medium

**Mitigation:**
- Check for valid auth token before accepting share
- If missing, save to App Group with "auth_required" flag
- Host app prompts login then processes queue
- Extension shows "Open BookMate to complete upload" message

**Owner:** Mobile Lead  
**Status:** Documented in UX_FLOW.md

---

### 7. Duplicate Uploads
**Risk:** User shares same file multiple times; creates duplicate records

**Likelihood:** Medium  
**Impact:** Low (data quality issue)

**Mitigation:**
- Generate content hash (SHA-256) for each file
- Backend deduplicates based on hash + user ID + 24-hour window
- Extension shows "This file was recently uploaded" if detected locally
- v1: accept duplicates; v1.1: add deduplication UI

**Owner:** Backend + Mobile Lead  
**Status:** Noted for v1.1

---

### 8. Large File Performance
**Risk:** Very large PDFs (50MB+) cause timeouts or crashes

**Likelihood:** Low  
**Impact:** Medium

**Mitigation:**
- Hard limit: 50MB per file in extension
- Larger files: show "Open in BookMate for large files" message
- Chunked upload for files >10MB
- Progress indicator in host app for queued uploads

**Owner:** iOS Lead  
**Status:** Covered in TECH_SPEC.md

---

### 9. iOS Version Fragmentation
**Risk:** Share extensions behave differently on iOS 16 vs 17 vs 18

**Likelihood:** Low  
**Impact:** Medium

**Mitigation:**
- Target iOS 16.0+ (covers 95% of users as of Nov 2025)
- Test on iOS 16, 17, 18 betas
- Feature flag to disable extension if critical bugs on specific iOS versions

**Owner:** QA + iOS Lead  
**Status:** Covered in QA_TEST_PLAN.md

---

## 📅 Milestones & Timeline

### Phase 0: Planning (CURRENT)
**Duration:** 1 week (Nov 12-18, 2025)  
**Status:** ✅ In Progress

**Deliverables:**
- [x] All planning docs created
- [ ] Risk mitigation plans approved
- [ ] Architecture reviewed by team
- [ ] API contract finalized with backend
- [ ] App Store items reserved (App Group, Bundle ID)

**Go/No-Go Criteria:**
- All risks have mitigation plans
- Backend confirms API endpoint availability
- Apple Developer account supports App Groups

---

### Phase 1: Development
**Duration:** 2 weeks (Nov 19 - Dec 2, 2025)  
**Status:** 📅 Scheduled

**Deliverables:**
- [ ] Expo Managed → EAS + Dev Client migration
- [ ] Share Extension target created
- [ ] App Group container setup
- [ ] File persistence + queue logic
- [ ] Host app handoff screen
- [ ] Upload API integration
- [ ] Basic telemetry events

**Go/No-Go Criteria:**
- Extension opens in < 800ms
- Single file upload succeeds on Wi-Fi
- Offline queue survives app kill
- Memory usage < 100MB peak
- No crashes in unit tests

---

### Phase 2: Internal QA
**Duration:** 1 week (Dec 3-9, 2025)  
**Status:** 📅 Planned

**Deliverables:**
- [ ] All test cases executed (see QA_TEST_PLAN.md)
- [ ] Performance benchmarks met
- [ ] Security checklist completed
- [ ] Bug fixes applied
- [ ] Telemetry data validation

**Go/No-Go Criteria:**
- Upload success rate ≥ 99%
- Zero P0/P1 bugs
- All security requirements met
- Performance targets achieved

---

### Phase 3: TestFlight Beta
**Duration:** 1 week (Dec 10-16, 2025)  
**Status:** 📅 Planned

**Deliverables:**
- [ ] TestFlight build with extension
- [ ] 10+ beta testers recruited
- [ ] Feedback survey sent
- [ ] Crash reports monitored
- [ ] Analytics dashboard configured

**Go/No-Go Criteria:**
- < 5% crash rate
- NPS ≥ 8/10 from beta testers
- No major UX issues reported
- Upload success rate ≥ 95% in production conditions

---

### Phase 4: App Store Submission
**Duration:** 3-5 days (Dec 17-22, 2025)  
**Status:** 📅 Planned

**Deliverables:**
- [ ] v1.1.0 build submitted
- [ ] Demo video uploaded
- [ ] Privacy policy updated (if needed)
- [ ] Release notes finalized
- [ ] Support team briefed

**Go/No-Go Criteria:**
- All TestFlight issues resolved
- Backend API confirmed stable
- Kill-switch ready (remote config)
- Rollback plan tested

---

### Phase 5: Production Rollout
**Duration:** Gradual (Dec 23, 2025 - Jan 5, 2026)  
**Status:** 📅 Planned

**Rollout Strategy:**
- Week 1: 10% of users (canary)
- Week 2: 50% of users
- Week 3: 100% of users

**Monitoring:**
- Real-time crash dashboard
- Upload success rate alerts (< 95% → page on-call)
- User feedback channels
- Support ticket volume

**Rollback Triggers:**
- Crash rate > 1%
- Upload success < 90%
- P0 security issue discovered

---

## 🎯 Version Scope

### v1.0 (This Release)
**Goal:** Basic file ingestion from share sheet

**Included:**
- ✅ Share images (.jpg, .jpeg, .png, .heic)
- ✅ Share PDFs
- ✅ Multiple file selection
- ✅ Offline queue with retry
- ✅ Basic telemetry
- ✅ Error handling

**Excluded:**
- ❌ On-device OCR
- ❌ Automatic categorization
- ❌ In-extension editing (crop, rotate)
- ❌ Text file support (.txt, .csv)
- ❌ Document scanning

---

### v1.1 (Future)
**Goal:** Intelligent receipt processing

**Planned:**
- Lightweight OCR (Apple Vision framework)
- Suggested category from image content
- Amount extraction
- Merchant name detection
- In-extension preview + annotation
- .txt and .csv support

**Timeline:** Q1 2026

---

## 📊 Performance Targets (Detailed)

### Latency Targets
| Operation | Target (Wi-Fi) | Target (4G) | Measurement |
|-----------|----------------|-------------|-------------|
| Extension open | < 800ms | < 800ms | Time from share tap to UI visible |
| File copy to App Group | < 200ms | < 200ms | Per file, <5MB |
| Image compression | < 1s | < 1s | 12MP → 8MP JPEG |
| Upload 1 photo | < 5s | < 15s | End-to-end with backend ACK |
| Upload 3 photos | < 12s | < 30s | Parallel uploads |
| Upload 1 PDF (<5MB) | < 3s | < 10s | No compression |
| Queue processing on foreground | < 2s | < 2s | From launch to first upload starts |

### Resource Targets
| Resource | Limit | Measurement |
|----------|-------|-------------|
| Extension memory | < 100MB | Peak usage during 3-photo share |
| Host app memory increase | < 50MB | When processing queue |
| App Group disk usage | < 500MB | Total pending files |
| Network bandwidth | Adaptive | Throttle on cellular if >10MB queued |
| Battery impact | < 2% | Per 10 uploads with screen off |

### Reliability Targets
| Metric | Target |
|--------|--------|
| Upload success rate (Wi-Fi) | ≥ 99.5% |
| Upload success rate (cellular) | ≥ 98% |
| Queue persistence | 100% |
| Extension crash rate | < 0.1% |
| Host app crash on handoff | < 0.05% |
| Failed upload retry success (1st retry) | ≥ 90% |
| Files lost due to bugs | 0 |

---

## 🚦 Go/No-Go Decision Framework

### Phase Gates

#### Gate 1: Planning Complete
**Decision Date:** Nov 18, 2025

**Criteria:**
- [ ] All docs approved by PM & iOS Lead
- [ ] Backend API contract signed off
- [ ] App Group & Bundle IDs reserved
- [ ] No unmitigated high risks

**Decision Maker:** PM + Engineering Lead

---

#### Gate 2: Development Complete
**Decision Date:** Dec 2, 2025

**Criteria:**
- [ ] All features implemented per spec
- [ ] Unit test coverage ≥ 80%
- [ ] Performance targets met in dev environment
- [ ] Security checklist complete
- [ ] Code review passed

**Decision Maker:** iOS Lead

---

#### Gate 3: QA Sign-Off
**Decision Date:** Dec 9, 2025

**Criteria:**
- [ ] All P0/P1 bugs fixed
- [ ] Upload success ≥ 99% in staging
- [ ] All test cases passed
- [ ] Performance validated on physical devices
- [ ] Accessibility audit passed

**Decision Maker:** QA Lead

---

#### Gate 4: TestFlight Launch
**Decision Date:** Dec 16, 2025

**Criteria:**
- [ ] Beta feedback positive (NPS ≥ 8)
- [ ] Crash rate < 5%
- [ ] No P0/P1 bugs from beta
- [ ] Analytics pipeline validated
- [ ] Support docs ready

**Decision Maker:** PM

---

#### Gate 5: Production Launch
**Decision Date:** Dec 23, 2025

**Criteria:**
- [ ] App Store approved
- [ ] Backend API load tested
- [ ] Kill-switch tested
- [ ] Monitoring dashboards live
- [ ] On-call rotation assigned

**Decision Maker:** Engineering Director

---

## 🔄 Rollback Plan (Summary)

See `ROLLBACK_PLAN.md` for full details.

**Fast Rollback (< 5 minutes):**
- Remote config flag disables share extension entry point
- Host app hides "Share to BookMate" from share sheet
- Users can't share new files; existing queue processes normally

**Full Rollback (< 1 hour):**
- Release v1.1.1 with extension target removed
- Submit to App Store for expedited review
- Notify users via in-app banner

**Triggers:**
- Crash rate > 1%
- Upload success < 90% for 1 hour
- P0 security vulnerability
- Backend API failure rate > 10%

---

## 📈 Success Criteria (Launch + 30 Days)

### Adoption Metrics
- [ ] ≥ 40% of active users tried share extension
- [ ] ≥ 60% of receipts uploaded via share sheet
- [ ] ≥ 85% share-to-upload completion rate

### Performance Metrics
- [ ] Upload success rate ≥ 99%
- [ ] p95 upload latency < 7s (Wi-Fi)
- [ ] Extension crash rate < 0.1%

### User Satisfaction
- [ ] NPS ≥ 8/10 for share feature
- [ ] < 5% users report upload failures
- [ ] Support tickets < 10/week related to share extension

### Business Impact
- [ ] 30%+ increase in receipts uploaded per user
- [ ] User retention +5% (users who use share vs those who don't)

---

## 🎯 Out of Scope (v1.0)

**Not Included:**
- Android share target (different architecture; separate project)
- macOS drag-and-drop support
- Apple Watch complications
- Siri shortcuts
- Batch OCR processing
- Automatic categorization (AI/ML)
- Third-party cloud storage (Dropbox, Google Drive)

**Future Considerations (Post v1.1):**
- Share extension for expense reports (multi-file with categorization)
- Integration with banking app deep links
- NFC receipt capture
- Receipt forwarding from email

---

## 📞 Stakeholder Contact

| Role | Name | Email | Responsibility |
|------|------|-------|----------------|
| PM | TBD | pm@siamoon.com | Overall project success |
| iOS Lead | TBD | ios-lead@siamoon.com | Technical implementation |
| Backend Lead | TBD | backend@siamoon.com | API development |
| QA Lead | TBD | qa@siamoon.com | Test execution |
| Security Reviewer | TBD | security@siamoon.com | Security audit |
| Support Lead | TBD | support@siamoon.com | User issue triage |

---

## 📚 Related Documents

- `UX_FLOW.md` - User stories and edge cases
- `TECH_SPEC.md` - Technical architecture
- `API_CONTRACT.md` - Backend integration
- `QA_TEST_PLAN.md` - Testing strategy
- `SECURITY_CHECKLIST.md` - Security requirements
- `ROLLBACK_PLAN.md` - Incident response
- `APP_STORE_ITEMS.md` - Apple Developer setup
- `ANALYTICS_EVENTS.md` - Telemetry spec

---

**Status:** ✅ Planning Phase Complete  
**Next Milestone:** Development Kickoff (Nov 19, 2025)  
**Risk Level:** 🟡 Medium (entitlements, review delays)  
**Confidence:** 🟢 High (well-scoped, risks mitigated)

---

*Last Updated: November 12, 2025*  
*Document Owner: PM + iOS Lead*  
*Next Review: After v1.0 App Store approval*
