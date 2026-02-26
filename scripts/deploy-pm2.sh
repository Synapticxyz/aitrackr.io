#!/bin/bash
# AiTrackr PM2 deployment (standalone, no Docker)
set -euo pipefail

APP_DIR="${APP_DIR:-/home/xflash/aitrackr}"
cd "$APP_DIR"

echo "[Deploy] Building..."
npm run build

echo "[Deploy] Copying artifacts to standalone..."
cp -r public .next/standalone/
cp .next/BUILD_ID .next/app-build-manifest.json .next/app-path-routes-manifest.json \
   .next/prerender-manifest.json .next/react-loadable-manifest.json \
   .next/required-server-files.json .next/images-manifest.json \
   .next/next-minimal-server.js.nft.json .next/standalone/.next/
cp -r .next/static .next/standalone/.next/
rm -rf .next/standalone/.next/server && cp -r .next/server .next/standalone/.next/
cp .env .next/standalone/

echo "[Deploy] Restarting PM2..."
pm2 restart aitrackr || pm2 start ecosystem.config.js

echo "✅ Deploy complete"
