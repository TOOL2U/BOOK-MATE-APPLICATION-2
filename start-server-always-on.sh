#!/bin/bash

# BookMate Always-On Server Startup Script
# This script keeps your Mac awake and runs the Expo server with tunnel mode
# so you can access the app from anywhere, even off your home WiFi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📱 BookMate Mobile - Always-On Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting Expo development server..."
echo "☕ Keeping your Mac awake (prevent sleep)..."
echo "🌐 Using tunnel mode (access from anywhere)..."
echo ""
echo "⚠️  IMPORTANT:"
echo "   • Keep this terminal window OPEN"
echo "   • Keep your Mac PLUGGED IN to power"
echo "   • Use Expo Go app to scan the QR code"
echo ""
echo "🔗 You can access this from:"
echo "   • Same WiFi network"
echo "   • Different WiFi networks"
echo "   • Cellular data"
echo "   • Anywhere with internet!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Keep Mac awake and run Expo with tunnel mode
caffeinate -disu npx expo start --tunnel
