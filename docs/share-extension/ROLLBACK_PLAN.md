# 🔙 iOS Share Extension — Rollback Plan

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Rollback Overview

This document defines procedures to disable or roll back the iOS Share Extension feature if critical issues arise post-launch.

**Goal:** Minimize user impact and restore service within 1 hour of incident detection

---

## 🚨 Rollback Triggers

### Critical (Immediate Rollback Required)

| Trigger                          | Severity | Max Response Time |
|----------------------------------|----------|-------------------|
| Extension crashes on launch      | P0       | 15 minutes        |
| Data loss (files not uploaded)   | P0       | 30 minutes        |
| Security breach detected         | P0       | 5 minutes         |
| Backend overload (500+ errors/min) | P0     | 15 minutes        |
| App Store review rejection       | P0       | N/A (pre-launch)  |

### High (Rollback Recommended)

| Trigger                          | Severity | Max Response Time |
|----------------------------------|----------|-------------------|
| Upload success rate <90%         | P1       | 1 hour            |
| Extension memory leak (>300MB)   | P1       | 2 hours           |
| User complaints >50/day          | P1       | 4 hours           |
| Performance degradation (>5s upload) | P1   | 2 hours           |

### Medium (Monitor, May Rollback)

| Trigger                          | Severity | Max Response Time |
|----------------------------------|----------|-------------------|
| Upload success rate 90-95%       | P2       | 24 hours          |
| Minor UI glitches                | P2       | 48 hours          |
| Compatibility issues (1 iOS version) | P2   | 48 hours          |

---

## 🛠️ Rollback Strategies

### Strategy 1: Remote Config Kill Switch (Fastest)
**Time to Execute:** <5 minutes  
**Impact:** Feature disabled without app update  
**Reversible:** Yes (instant)

**When to Use:**
- Critical bugs discovered post-launch
- Backend overload
- Security incident
- Need to disable feature immediately

**Procedure:**

1. **Update Remote Config**
```json
// Firebase Remote Config or similar
{
  "share_extension_enabled": false  // Change from true → false
}
```

2. **Publish Config**
```bash
# Firebase Console:
# Remote Config → Edit → Publish Changes
# Takes effect in <1 minute
```

3. **Verify Deployment**
```bash
# Check user-facing behavior:
# - Extension shows "Feature temporarily unavailable"
# - Files NOT saved to App Group
# - User sees clear error message
```

4. **Monitor Impact**
```bash
# Analytics query:
# COUNT users WHERE feature_disabled_shown > 0
# Last 15 minutes
```

**User Experience:**
```
User shares photo → Taps "BookMate" → Extension opens

Extension UI:
┌─────────────────────────┐
│ ⚠️ Temporarily          │
│    Unavailable          │
│                         │
│ This feature is         │
│ temporarily disabled.   │
│                         │
│ Please use the main     │
│ app to upload receipts. │
│                         │
│      [OK]               │
└─────────────────────────┘
```

**Code Implementation:**
```swift
// ShareViewController.swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    // Check remote config
    let isEnabled = RemoteConfig.shared.getBool(
        "share_extension_enabled",
        defaultValue: true
    )
    
    if !isEnabled {
        showMaintenanceMessage()
        dismissExtension()
        return
    }
    
    // Continue normal flow...
}

func showMaintenanceMessage() {
    let alert = UIAlertController(
        title: "Temporarily Unavailable",
        message: "This feature is temporarily disabled. Please use the main app to upload receipts.",
        preferredStyle: .alert
    )
    alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
        self.dismissExtension()
    })
    present(alert, animated: true)
}
```

---

### Strategy 2: App Update with Extension Removed (Slow)
**Time to Execute:** 2-4 hours (build) + 1-2 days (App Review)  
**Impact:** Extension completely removed  
**Reversible:** Yes (another app update)

**When to Use:**
- Remote config kill switch insufficient
- Extension causing app-wide crashes
- Need to completely remove feature

**Procedure:**

1. **Revert Code Changes**
```bash
# Git revert to pre-extension version
git log --oneline  # Find commit before extension merge
git revert {commit_hash}

# Or manually:
# - Remove ShareExtension target from Xcode
# - Remove extension entitlements
# - Remove extension files
```

2. **Bump Version**
```json
// app.json
{
  "expo": {
    "version": "1.1.1",  // Increment patch version
    "ios": {
      "buildNumber": "4"  // Increment build
    }
  }
}
```

3. **Build & Submit**
```bash
# EAS build
eas build --platform ios --profile production

# Wait for build to complete (~15-20 min)

# Submit to App Store
eas submit --platform ios
```

4. **Expedited Review Request**
```
App Store Connect → App → Versions → 1.1.1
→ App Review Information
→ Notes: "Critical bug fix: disabling problematic feature. Previous version causing crashes."
→ Request Expedited Review (if critical)
```

5. **Monitor App Review**
```
Expected timeline:
- Expedited: 1-4 hours
- Normal: 24-48 hours
```

6. **Release After Approval**
```
App Store Connect → Release manually or automatic
```

---

### Strategy 3: Server-Side Upload Rejection (Partial Rollback)
**Time to Execute:** <10 minutes  
**Impact:** Extension works, but uploads fail gracefully  
**Reversible:** Yes (instant)

**When to Use:**
- Backend unable to handle load
- Need to prevent new uploads while keeping extension UI functional
- Processing pipeline broken

**Procedure:**

1. **Update Backend Endpoint**
```javascript
// POST /api/mobile/ingest
router.post('/ingest', async (req, res) => {
  // Add feature flag check
  const extensionEnabled = await getFeatureFlag('share_extension_ingestion');
  
  if (!extensionEnabled) {
    return res.status(503).json({
      ok: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Upload service temporarily unavailable. Please try again later.',
        details: { retryAfter: 3600 }
      }
    });
  }
  
  // Continue normal processing...
});
```

2. **Toggle Feature Flag**
```sql
-- In backend database or admin panel
UPDATE feature_flags
SET enabled = false
WHERE name = 'share_extension_ingestion';
```

3. **Monitor Client Behavior**
```
Expected user experience:
- Extension opens normally
- User taps "Send to BookMate"
- Extension dismisses
- File saved to App Group locally
- Host app attempts upload
- Upload fails with 503
- Host app shows: "Upload service temporarily unavailable"
- File remains in local queue
- Auto-retries when service restored
```

---

## 📊 Rollback Decision Matrix

| Issue                     | Kill Switch | App Update | Server Reject | Do Nothing |
|---------------------------|-------------|------------|---------------|------------|
| Extension crashes         | ✅          | ✅          | ❌            | ❌          |
| Data loss                 | ✅          | ✅          | ❌            | ❌          |
| Security breach           | ✅          | ✅          | ✅            | ❌          |
| Backend overload          | ⚠️          | ❌          | ✅            | ❌          |
| Upload success <90%       | ⚠️          | ⚠️          | ✅            | ❌          |
| Memory leak               | ✅          | ✅          | ❌            | ❌          |
| Minor UI glitch           | ❌          | ⚠️          | ❌            | ✅          |
| Single iOS version issue  | ❌          | ⚠️          | ❌            | ✅          |

**Legend:**
- ✅ Recommended
- ⚠️ Consider (depends on severity)
- ❌ Not applicable / Not recommended

---

## 🔄 Rollback Execution Checklist

### Pre-Rollback
- [ ] Incident confirmed and severity assessed
- [ ] Product Manager notified
- [ ] iOS Lead notified
- [ ] Decision: Which rollback strategy?
- [ ] Estimated user impact calculated
- [ ] Communication plan prepared (user-facing message)

### During Rollback
- [ ] Rollback strategy executed (see procedures above)
- [ ] Change deployed to production
- [ ] Monitoring dashboards checked
- [ ] User impact verified (error rate drops)
- [ ] Support team notified (prepare for user inquiries)

### Post-Rollback
- [ ] Incident post-mortem scheduled (within 48 hours)
- [ ] Root cause analysis completed
- [ ] Bug fix or mitigation plan created
- [ ] Timeline for re-enabling feature determined
- [ ] Stakeholders updated (PM, CTO, CEO if needed)

---

## 📞 Incident Response Team

### On-Call Rotation

| Role                | Primary Contact        | Backup Contact         |
|---------------------|------------------------|------------------------|
| iOS Lead            | Shaun Ducker           | TBD                    |
| Backend Lead        | TBD                    | TBD                    |
| DevOps/SRE          | TBD                    | TBD                    |
| Product Manager     | TBD                    | TBD                    |
| CTO (Escalation)    | TBD                    | -                      |

### Contact Methods
- **Slack:** #incident-response (immediate)
- **PagerDuty:** For P0 incidents (24/7)
- **Email:** incidents@siamoon.com

---

## 📈 Monitoring & Alerts

### Key Metrics to Monitor (Post-Launch)

```yaml
# Datadog / Prometheus Alerts
alerts:
  - name: "Share Extension Crash Rate"
    condition: crash_rate > 1%
    severity: P0
    notify: pagerduty
    
  - name: "Upload Success Rate Low"
    condition: upload_success_rate < 90%
    severity: P1
    notify: slack
    
  - name: "Extension Memory Leak"
    condition: avg_memory_usage > 200MB
    severity: P1
    notify: slack
    
  - name: "Backend 500 Errors"
    condition: error_rate_5xx > 5%
    severity: P0
    notify: pagerduty
    
  - name: "Upload Latency High"
    condition: p95_upload_time > 15s
    severity: P2
    notify: slack
```

### Dashboard (Grafana / Datadog)
```
Panel 1: Extension Activation Count (hourly)
Panel 2: Upload Success Rate (%)
Panel 3: Upload Latency (p50, p95, p99)
Panel 4: Extension Crash Rate (%)
Panel 5: Memory Usage (avg, max)
Panel 6: Backend Error Rate (by status code)
```

---

## 🧪 Rollback Testing (Pre-Launch)

### Test Kill Switch
```bash
# 1. Set feature flag to false
firebase remoteconfig:set share_extension_enabled false

# 2. Open extension on test device
# Expected: "Feature temporarily unavailable" message

# 3. Re-enable feature
firebase remoteconfig:set share_extension_enabled true

# 4. Verify extension works again
```

### Test Server-Side Rejection
```bash
# 1. Disable backend ingestion
curl -X POST http://localhost:8000/admin/feature-flags \
  -d '{"share_extension_ingestion": false}'

# 2. Share file from device
# Expected: 503 error, file queued locally

# 3. Re-enable ingestion
curl -X POST http://localhost:8000/admin/feature-flags \
  -d '{"share_extension_ingestion": true}'

# 4. Verify queued file uploads automatically
```

---

## 📝 Rollback Communication Templates

### Internal (Slack #engineering)
```
🚨 **Incident Alert: Share Extension Disabled**

**Issue:** [Brief description]
**Severity:** P0
**Action Taken:** Kill switch activated
**Impact:** ~X,XXX users affected
**Status:** Feature disabled, investigating root cause
**ETA:** Fix in progress, update in 30 minutes

**Next Steps:**
1. Root cause analysis
2. Bug fix
3. Testing
4. Re-enable feature

cc: @ios-team @backend-team @product
```

### User-Facing (In-App Message)
```
⚠️ **Share Extension Temporarily Unavailable**

We're currently experiencing technical issues with the "Share to BookMate" feature. 

**Workaround:** You can still upload receipts using the main app's upload button.

We're working on a fix. Thank you for your patience!
```

### App Store Review (If Expedited Review Needed)
```
Subject: Expedited Review Request - Critical Bug Fix

Dear App Review Team,

We respectfully request an expedited review for BookMate v1.1.1.

**Reason for Expedited Review:**
Version 1.1.0 (currently live) contains a critical bug in the iOS Share Extension that causes [specific issue]. This impacts [X%] of our users.

**Changes in v1.1.1:**
- Disabled problematic Share Extension feature
- No other changes (minimal risk)

**User Impact:**
Users experiencing [describe issue]. We need to deploy this fix urgently to restore service.

**Testing:**
Thoroughly tested on iOS 17.0-17.3, all device sizes. No regressions detected.

Thank you for your consideration.

Best regards,
BookMate Team
```

---

## 🔍 Post-Mortem Template

### Incident Post-Mortem (Example)

**Date:** November 15, 2025  
**Duration:** 2 hours  
**Severity:** P0  
**Impact:** 1,234 users affected

**Timeline:**
- 14:00 UTC: Share Extension v1.1 released
- 16:30 UTC: Crash reports spike detected
- 16:35 UTC: Incident declared, on-call engineer paged
- 16:40 UTC: Kill switch activated (feature disabled)
- 16:45 UTC: Crash rate drops to 0%
- 18:00 UTC: Root cause identified (memory leak in image compression)
- 18:30 UTC: Fix deployed to staging
- 19:00 UTC: Testing complete
- 20:00 UTC: Kill switch reversed (feature re-enabled)

**Root Cause:**
Image compression logic was not releasing memory properly, causing extension to exceed iOS memory limit (120MB) and crash.

**Resolution:**
Added `autoreleasepool` around image compression loop to release memory incrementally.

**Action Items:**
- [ ] Add memory usage monitoring to CI/CD
- [ ] Implement pre-launch load testing with large images
- [ ] Add memory usage alerts (<100MB warning, >150MB critical)
- [ ] Update QA test plan with memory stress tests

**Lessons Learned:**
- Kill switch worked perfectly (5min to disable)
- Need better memory profiling before launch
- Should have tested with 10+ large images (>20MB each)

---

## ✅ Rollback Readiness Checklist

### Before Launch
- [ ] Remote config kill switch implemented and tested
- [ ] Server-side feature flag implemented
- [ ] Monitoring alerts configured
- [ ] Incident response team identified
- [ ] Communication templates prepared
- [ ] Rollback procedures documented and reviewed
- [ ] Test rollback in staging environment

### Day 0 (Launch Day)
- [ ] All on-call engineers available
- [ ] Monitoring dashboards open
- [ ] Slack #incident-response channel active
- [ ] Support team briefed on potential issues

### Week 1 (Post-Launch)
- [ ] Daily metric review (crash rate, upload success)
- [ ] User feedback monitored
- [ ] Performance trends analyzed
- [ ] No P0/P1 incidents → declare launch successful

---

**Status:** ✅ Rollback Plan Complete  
**Next:** Repository scoping and Expo migration guide  
**Review:** Pending iOS Lead and DevOps approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + SRE/DevOps*
