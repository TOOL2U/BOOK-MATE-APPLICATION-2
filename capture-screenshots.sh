#!/bin/bash

# BookMate iOS Screenshot Capture Script
# Captures App Store screenshots from iOS Simulator
# Requires: iOS Simulator running with BookMate app loaded

echo "📸 BookMate Screenshot Capture Tool"
echo "===================================="
echo ""

# Set output directory
OUTPUT_DIR="./assets/screenshots/ios"
mkdir -p "$OUTPUT_DIR"

# Get the booted simulator ID
SIMULATOR_ID=$(xcrun simctl list devices | grep "Booted" | head -1 | grep -E -o '[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}')

if [ -z "$SIMULATOR_ID" ]; then
    echo "❌ No simulator is currently booted."
    echo "Please start the iOS simulator first using: npx expo start --ios"
    exit 1
fi

# Get simulator name
SIMULATOR_NAME=$(xcrun simctl list devices | grep "$SIMULATOR_ID" | cut -d '(' -f1 | xargs)

echo "✅ Found simulator: $SIMULATOR_NAME"
echo "📱 Simulator ID: $SIMULATOR_ID"
echo ""

# Function to capture screenshot
capture_screenshot() {
    local num=$1
    local description=$2
    local filename="bookmate_screenshot_$(printf "%02d" $num).png"
    local filepath="$OUTPUT_DIR/$filename"
    
    echo "📸 Screenshot $num: $description"
    echo "   Press ENTER when the screen is ready, or type 'skip' to skip..."
    read -r response
    
    if [ "$response" = "skip" ]; then
        echo "   ⏭️  Skipped"
        return
    fi
    
    # Capture the screenshot
    xcrun simctl io booted screenshot "$filepath"
    
    if [ -f "$filepath" ]; then
        # Get file size and dimensions
        filesize=$(du -h "$filepath" | cut -f1)
        dimensions=$(sips -g pixelWidth -g pixelHeight "$filepath" | grep -E "pixelWidth|pixelHeight" | awk '{print $2}' | paste -sd 'x' -)
        echo "   ✅ Saved: $filename ($dimensions, $filesize)"
    else
        echo "   ❌ Failed to capture screenshot"
    fi
    
    echo ""
}

echo "🎬 Ready to capture screenshots!"
echo ""
echo "Instructions:"
echo "1. Navigate to each screen in the app manually"
echo "2. Press ENTER when ready to capture"
echo "3. Type 'skip' to skip a screenshot"
echo ""
echo "===================================="
echo ""

# Capture all 5 required screenshots
capture_screenshot 1 "Dashboard Overview - Your Complete Financial Overview"
capture_screenshot 2 "Reports & Analytics - Smart AI-Powered Insights"
capture_screenshot 3 "Transaction List - Real-Time Transaction Tracking"
capture_screenshot 4 "Receipt Scanning - Instant Receipt Processing"
capture_screenshot 5 "Property Management - Multi-Property Bookkeeping Made Simple"

echo "===================================="
echo ""
echo "✅ Screenshot capture complete!"
echo ""
echo "📁 Screenshots saved to: $OUTPUT_DIR"
echo ""

# List captured screenshots
echo "📋 Captured files:"
ls -lh "$OUTPUT_DIR"/*.png 2>/dev/null || echo "   No PNG files found"

echo ""
echo "🔍 Next Steps:"
echo "1. Review screenshots in $OUTPUT_DIR"
echo "2. Verify resolution and quality"
echo "3. Commit to repository: git add $OUTPUT_DIR/*.png"
echo "4. Upload to App Store Connect"
echo ""
