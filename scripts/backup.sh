#!/bin/bash
# AiTrackr database backup
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/aitrackr}"
DAYS_TO_KEEP=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="aitrackr_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[Backup] Starting backup at $TIMESTAMP"

# Dump and compress
docker exec aitrackr-db pg_dump -U postgres aitrackr | gzip > "$BACKUP_DIR/$FILENAME"

echo "[Backup] Saved: $BACKUP_DIR/$FILENAME"

# Rotate old backups
find "$BACKUP_DIR" -name "aitrackr_*.sql.gz" -mtime "+${DAYS_TO_KEEP}" -delete

KEPT=$(find "$BACKUP_DIR" -name "aitrackr_*.sql.gz" | wc -l)
echo "[Backup] Complete. Keeping $KEPT backups."
