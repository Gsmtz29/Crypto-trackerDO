#!/bin/bash
APP_DIR="$HOME/crypto-tracker"
LOG_SCRIPT="$APP_DIR/backend/logs/app.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: Deteniendo Crypto Price Tracker..." | tee -a "$LOG_SCRIPT"
cd "$APP_DIR"
docker compose stop
echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: Aplicación detenida." | tee -a "$LOG_SCRIPT"
