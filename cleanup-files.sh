#!/bin/bash

echo "🗑️  Starting file cleanup..."

# Phase 1: Delete old documentation files (60 files)
echo "Phase 1: Removing old documentation..."
rm -f API_RECONNECTION_SUCCESS.md
rm -f AUDIT_SYSTEM_SUMMARY.md
rm -f BALANCE_AUDIT_IMPLEMENTATION_GUIDE.md
rm -f BALANCE_PL_DISPLAY_FIX.md
rm -f BALANCE_VERIFICATION_REPORT.md
rm -f BRAND_REDESIGN_COMPLETION_REPORT.md
rm -f CHANGELOG_UI_REDESIGN.md
rm -f CORRECTION_SUMMARY.md
rm -f CRITICAL_SECRET_MISMATCH_DIAGNOSIS.md
rm -f CRITICAL_UPDATE_DROPDOWN_VALUES.md
rm -f DEVELOPMENT_SUMMARY.md
rm -f DIAGNOSIS_ENV_LOCAL_VS_VERCEL.md
rm -f ENVIRONMENT_VARIABLES_CHECKLIST.md
rm -f FINAL_TEST_RESULTS_AFTER_FIX.md
rm -f FOR_WEBAPP_TEAM.md
rm -f HANDOFF.md
rm -f INTEGRATION_STATUS.md
rm -f LOGO_CORRECTION_COMPLETE.md
rm -f LOGO_INTEGRATION_COMPLETE.md
rm -f LOGO_SIMPLE_IMPLEMENTATION.md
rm -f LOTTIE_IMPLEMENTATION_GUIDE.md
rm -f LOTTIE_IMPLEMENTATION.md
rm -f LOTTIE_TROUBLESHOOTING.md
rm -f MANUAL_SCREEN_IMPROVEMENTS.md
rm -f MOBILE_API_INTEGRATION_GUIDE_CHANGELOG.md
rm -f MOBILE_API_INTEGRATION_GUIDE.md
rm -f MOBILE_TEAM_REPLY.md
rm -f MOBILE_TEAM_RESPONSE_TO_WEBAPP.md
rm -f MOBILE_TEAM_TESTING_NOW.md
rm -f OFFICIAL_LOGO_USAGE.md
rm -f PHASE_1_TEST_RESULTS.md
rm -f PHASE_2_PROGRESS.md
rm -f PM_CONNECTIVITY_CHECKLIST.md
rm -f PM_CRITICAL_FIX_APPLIED.md
rm -f PM_MOBILE_APP_READY.md
rm -f PM_STATUS_REPORT.md
rm -f PRODUCTION_READINESS_AUDIT.md
rm -f PROJECT_STATUS.md
rm -f PROPERTY_PERSON_MODAL_ENHANCEMENT.md
rm -f PROPERTY_PERSON_MODAL_FIXED.md
rm -f REAL_API_INTEGRATION_COMPLETE.md
rm -f REPLY_TO_WEBAPP_TEAM.md
rm -f RESPONSE_TO_MOBILE_TEAM.md
rm -f RESTORE_WORK.sh
rm -f SUCCESS_ALL_ENDPOINTS_WORKING.md
rm -f TEST_RESULTS_CLEARER_ERROR.md
rm -f TEST_RESULTS_SUMMARY.md
rm -f UNIFIED_BALANCE_IMPLEMENTATION_STATUS.md
rm -f UNIFIED_BALANCE_README.md
rm -f UNIFIED_BALANCE_SYSTEM_COMPLETE.md
rm -f URGENT_STILL_UNAUTHORIZED.md
rm -f VERIFICATION_CHECKLIST.md
rm -f WEBAPP_TEAM_AUTHENTICATION_CLARIFICATION.md
rm -f WEBAPP_TEAM_CONNECTION_CHECKLIST.md
rm -f WEBAPP_TEAM_EMAIL.md
rm -f WEBAPP_TEAM_REPLY_TO_MOBILE.md
rm -f WEBAPP_TEAM_RESPONSE_INDEX.md
rm -f WEBAPP_TEAM_STATUS_REPORT.md
rm -f FILE_CLEANUP_ANALYSIS.md
rm -f PM_V9.1_SUMMARY.md

echo "✅ Phase 1 complete: Old documentation removed"

# Phase 2: Delete duplicate fonts in app/fonts/
echo "Phase 2: Removing duplicate fonts..."
rm -rf app/fonts/

echo "✅ Phase 2 complete: Duplicate fonts removed"

# Phase 3: Delete docs/ folder
echo "Phase 3: Removing docs folder..."
rm -rf docs/

echo "✅ Phase 3 complete: Docs folder removed"

# Phase 4: Delete old test files (keep test-transfer.js)
echo "Phase 4: Removing old test files..."
rm -f balance-audit-mock-test.js
rm -f balance-audit-test.js
rm -f balance-verification-test.js
rm -f test-api-comprehensive.js
rm -f test-api-simple.js
rm -f test-api.js
rm -f test-manual-entry.js
rm -f verify-dropdown-values.js

echo "✅ Phase 4 complete: Old test files removed"

echo ""
echo "🎉 Cleanup complete!"
echo "Files remaining in root:"
ls -1 *.md *.json *.js *.sh 2>/dev/null | wc -l
