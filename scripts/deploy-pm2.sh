#!/bin/bash
# AiTrackr PM2 deployment (next start, no standalone)
set -euo pipefail

APP_DIR="${APP_DIR:-/home/xflash/aitrackr}"
cd "$APP_DIR"

echo "[Deploy] Building..."
npm run build

echo "[Deploy] Restarting PM2..."
pm2 restart aitrackr || pm2 start ecosystem.config.js

echo "✅ Deploy complete"
