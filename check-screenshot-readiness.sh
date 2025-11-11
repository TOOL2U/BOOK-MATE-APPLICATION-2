#!/bin/bash

# BookMate Screenshot Readiness Check
# Verifies everything is ready before screenshot capture

echo "📋 BookMate Screenshot Readiness Check"
echo "======================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_passed=0
check_failed=0

# Function to check a condition
check() {
    local name=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name"
        ((check_passed++))
        return 0
    else
        echo -e "${RED}❌${NC} $name"
        ((check_failed++))
        return 1
    fi
}

check_warning() {
    local name=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name"
        ((check_passed++))
        return 0
    else
        echo -e "${YELLOW}⚠️${NC}  $name"
        return 1
    fi
}

echo "1. Prerequisites"
echo "----------------"

check "Xcode Command Line Tools installed" "which xcrun"
check "Simulator available" "xcrun simctl list devices | grep -q iPhone"
check "Screenshot output directory exists" "test -d assets/screenshots/ios"

echo ""
echo "2. Capture Scripts"
echo "------------------"

check "Automated capture script exists" "test -f capture-screenshots-auto.sh"
check "Interactive capture script exists" "test -f capture-screenshots.sh"
check "Scripts are executable" "test -x capture-screenshots-auto.sh"

echo ""
echo "3. Simulator Check"
echo "------------------"

# Check if any simulator is booted
if xcrun simctl list devices | grep -q "Booted"; then
    BOOTED_DEVICE=$(xcrun simctl list devices | grep "Booted" | head -1 | cut -d '(' -f1 | xargs)
    echo -e "${GREEN}✅${NC} Simulator running: $BOOTED_DEVICE"
    ((check_passed++))
else
    echo -e "${YELLOW}⚠️${NC}  No simulator currently running"
    echo "   Run: npx expo start --ios"
fi

echo ""
echo "4. App Status"
echo "-------------"

# Check if expo is running
if lsof -i :8081 > /dev/null 2>&1 || lsof -i :8082 > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Expo dev server running"
    ((check_passed++))
else
    echo -e "${YELLOW}⚠️${NC}  Expo dev server not detected"
    echo "   Run: npx expo start --ios"
fi

# Check if we have the right device type
if xcrun simctl list devices available | grep -q "iPhone 16 Pro Max"; then
    echo -e "${GREEN}✅${NC} iPhone 16 Pro Max simulator available"
    ((check_passed++))
elif xcrun simctl list devices available | grep -q "iPhone 15 Pro Max"; then
    echo -e "${GREEN}✅${NC} iPhone 15 Pro Max simulator available"
    ((check_passed++))
else
    echo -e "${YELLOW}⚠️${NC}  Pro Max simulator recommended for best resolution"
fi

echo ""
echo "5. Documentation"
echo "----------------"

check "Screenshot implementation guide exists" "test -f SCREENSHOT_CAPTURE_IMPLEMENTATION.md"
check "Screenshot README exists" "test -f assets/screenshots/ios/README.md"
check "Immediate screenshot prep guide exists" "test -f IMMEDIATE_SCREENSHOT_PREPARATION.md"

echo ""
echo "======================================="
echo ""

# Summary
total_checks=$((check_passed + check_failed))
echo "Summary: $check_passed/$total_checks checks passed"
echo ""

if [ $check_failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure app is running in simulator: npx expo start --ios"
    echo "2. Run screenshot capture: ./capture-screenshots-auto.sh"
    echo ""
    echo "Or read the full guide:"
    echo "   open SCREENSHOT_CAPTURE_IMPLEMENTATION.md"
else
    echo -e "${YELLOW}⚠️  Some checks failed. Review above for details.${NC}"
    echo ""
    echo "Common fixes:"
    echo "• Install Xcode: xcode-select --install"
    echo "• Start app: npx expo start --ios"
    echo "• Create output dir: mkdir -p assets/screenshots/ios"
fi

echo ""
