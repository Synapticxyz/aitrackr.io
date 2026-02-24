#!/bin/bash
# AiTrackr deployment script
set -euo pipefail

APP_DIR="${APP_DIR:-/home/xflash/aitrackr}"
cd "$APP_DIR"

echo "═══════════════════════════════════════"
echo "  AiTrackr Deploy — $(date)"
echo "═══════════════════════════════════════"

# 1. Backup database
echo "[Deploy] Step 1/5: Backing up database..."
bash scripts/backup.sh

# 2. Pull latest code
echo "[Deploy] Step 2/5: Pulling latest code..."
git pull origin main

# 3. Build new image
echo "[Deploy] Step 3/5: Building Docker image..."
docker compose build app

# 4. Start services (zero-downtime)
echo "[Deploy] Step 4/5: Starting services..."
docker compose up -d --remove-orphans

# 5. Run database migrations
echo "[Deploy] Step 5/5: Running migrations..."
docker compose exec -T app npx prisma migrate deploy

echo "✅ Deploy complete at $(date)"
