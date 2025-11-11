#!/bin/bash

# BookMate iOS Automated Screenshot Capture
# Captures all required App Store screenshots automatically

set -e  # Exit on error

echo "📸 BookMate iOS Automated Screenshot Capture"
echo "============================================="
echo ""

# Configuration
OUTPUT_DIR="./assets/screenshots/ios"
SIMULATOR_NAME="iPhone 16 Pro Max"
BUNDLE_ID="com.siamoon.bookmate"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🔧 Configuration:"
echo "   Output: $OUTPUT_DIR"
echo "   Device: $SIMULATOR_NAME"
echo "   Bundle: $BUNDLE_ID"
echo ""

# Find the simulator ID for iPhone 16 Pro Max
echo "🔍 Finding simulator..."
SIMULATOR_ID=$(xcrun simctl list devices available | grep "$SIMULATOR_NAME" | head -1 | grep -o "\([A-Z0-9\-]*\)" | head -1)

if [ -z "$SIMULATOR_ID" ]; then
    echo "❌ Could not find $SIMULATOR_NAME simulator"
    echo "Available simulators:"
    xcrun simctl list devices available | grep "iPhone"
    exit 1
fi

echo "✅ Found: $SIMULATOR_NAME"
echo "   ID: $SIMULATOR_ID"
echo ""

# Check if simulator is already booted
BOOT_STATUS=$(xcrun simctl list devices | grep "$SIMULATOR_ID" | grep -o "Booted" || echo "Shutdown")

if [ "$BOOT_STATUS" = "Shutdown" ]; then
    echo "🚀 Booting simulator..."
    xcrun simctl boot "$SIMULATOR_ID"
    sleep 10  # Wait for simulator to fully boot
    echo "✅ Simulator booted"
else
    echo "✅ Simulator already running"
fi

echo ""
echo "📱 Opening simulator window..."
open -a Simulator

# Wait for simulator UI to load
sleep 5

echo ""
echo "⏳ Waiting for app to be ready..."
echo "   (Make sure the app is running in the simulator)"
sleep 10

echo ""
echo "📸 Starting screenshot capture..."
echo ""

# Function to capture screenshot with delay
capture_screenshot() {
    local num=$1
    local description=$2
    local filename="bookmate_screenshot_$(printf "%02d" $num).png"
    local filepath="$OUTPUT_DIR/$filename"
    
    echo "Screenshot $num: $description"
    
    # Wait before capture to allow UI to settle
    sleep 2
    
    # Capture the screenshot
    xcrun simctl io "$SIMULATOR_ID" screenshot "$filepath"
    
    if [ -f "$filepath" ]; then
        # Get dimensions and file size
        filesize=$(du -h "$filepath" | cut -f1)
        dimensions=$(sips -g pixelWidth -g pixelHeight "$filepath" 2>/dev/null | grep -E "pixelWidth|pixelHeight" | awk '{print $2}' | paste -sd 'x' - || echo "unknown")
        echo "   ✅ Captured: $filename ($dimensions, $filesize)"
        
        # Check if resolution is correct for iPhone 16 Pro Max (1320x2868 or 1290x2796)
        width=$(sips -g pixelWidth "$filepath" 2>/dev/null | grep pixelWidth | awk '{print $2}')
        height=$(sips -g pixelHeight "$filepath" 2>/dev/null | grep pixelHeight | awk '{print $2}')
        
        if [ ! -z "$width" ] && [ ! -z "$height" ]; then
            if [ "$width" -ge 1200 ] && [ "$height" -ge 2400 ]; then
                echo "   ✅ Resolution OK for App Store"
            else
                echo "   ⚠️  Warning: Resolution may be too low ($width x $height)"
            fi
        fi
    else
        echo "   ❌ Failed to capture screenshot"
        return 1
    fi
    
    echo ""
}

# Instructions for manual navigation
echo "🎯 MANUAL NAVIGATION REQUIRED"
echo "=============================="
echo ""
echo "This script will capture 5 screenshots with 15-second intervals."
echo "Please navigate to each screen manually in the simulator:"
echo ""
echo "1. Dashboard Overview (Balance cards, quick actions)"
echo "2. Reports & Analytics (P&L chart, AI insights)"
echo "3. Transaction List (Recent transactions, sync status)"
echo "4. Receipt Scanning (Camera or upload interface)"
echo "5. Property Management (Allocations, transfers)"
echo ""
echo "Press ENTER to start the capture sequence..."
read

# Capture screenshots with navigation time
echo "📸 Capture 1/5 - Starting in 3 seconds..."
echo "   → Navigate to: Dashboard Overview"
sleep 3
capture_screenshot 1 "Dashboard Overview"

echo "⏳ 15 seconds to navigate to Reports..."
echo "   → Navigate to: Reports & Analytics"
sleep 15
capture_screenshot 2 "Reports & Analytics"

echo "⏳ 15 seconds to navigate to Transactions..."
echo "   → Navigate to: Transaction List"
sleep 15
capture_screenshot 3 "Transaction List"

echo "⏳ 15 seconds to navigate to Receipt Scanning..."
echo "   → Navigate to: Receipt Scanning"
sleep 15
capture_screenshot 4 "Receipt Scanning"

echo "⏳ 15 seconds to navigate to Property Management..."
echo "   → Navigate to: Property Management"
sleep 15
capture_screenshot 5 "Property Management"

echo "============================================="
echo ""
echo "✅ Screenshot capture complete!"
echo ""
echo "📁 Output directory: $OUTPUT_DIR"
echo ""

# List all captured screenshots
echo "📋 Captured Screenshots:"
ls -lh "$OUTPUT_DIR"/*.png 2>/dev/null | awk '{print "   " $9 " - " $5}'

echo ""
echo "🔍 Verification Steps:"
echo "   1. Open $OUTPUT_DIR to review screenshots"
echo "   2. Check that all images show correct screens"
echo "   3. Verify resolution is adequate for App Store"
echo "   4. Ensure no placeholder or test data is visible"
echo ""
echo "✅ Next Steps:"
echo "   1. Review screenshots: open $OUTPUT_DIR"
echo "   2. Commit to repo: git add $OUTPUT_DIR/*.png"
echo "   3. Run: git commit -m 'Add App Store screenshots for iOS v1.0.1'"
echo "   4. Push: git push origin main"
echo "   5. Upload to App Store Connect"
echo ""
