#!/bin/bash
# Cloud server setup script for persistent Expo development

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Expo CLI globally
npm install -g @expo/cli eas-cli

# Clone your repository
git clone https://github.com/TOOL2U/BOOK-MATE-APPLICATION-2.git
cd BOOK-MATE-APPLICATION-2

# Install dependencies
npm install

# Start Expo with tunnel (accessible from anywhere)
# Use screen to keep it running even when SSH disconnects
screen -S expo-dev
expo start --tunnel --dev-client

# Detach from screen: Ctrl+A, then D
# Reattach later: screen -r expo-dev