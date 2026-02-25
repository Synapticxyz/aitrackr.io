#!/usr/bin/env bash
# AiTrackr Chrome Extension — Build & Package Script
set -e

VERSION=$(node -p "require('./manifest.json').version")
OUT="dist/aitrackr-extension-v${VERSION}.zip"

echo "Building AiTrackr Extension v${VERSION}..."

# Clean
rm -rf dist
mkdir -p dist

# Copy extension files
cp manifest.json dist/
cp background.js dist/
cp content.js dist/
cp popup.html popup.js dist/
cp options.html options.js dist/
cp -r icons dist/

# Create zip
cd dist
zip -r "aitrackr-extension-v${VERSION}.zip" \
  manifest.json background.js content.js \
  popup.html popup.js \
  options.html options.js \
  icons/
cd ..

echo ""
echo "✅ Built: extension/${OUT}"
echo ""
echo "To install in Chrome:"
echo "  1. Go to chrome://extensions"
echo "  2. Enable 'Developer mode'"
echo "  3. Click 'Load unpacked' → select extension/dist/"
echo "     OR 'Pack extension' and use the .zip"
echo ""
echo "Files in dist/:"
ls -lh dist/
