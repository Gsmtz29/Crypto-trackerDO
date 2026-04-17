#!/bin/bash
set -e

echo "======================================================"
echo " [DEPLOY] Crypto Price Tracker - Despliegue en EC2"
echo "======================================================"

REPO_URL="https://github.com/TU_USUARIO/crypto-tracker.git"
APP_DIR="$HOME/crypto-tracker"

# 1. Clonar o actualizar
if [ -d "$APP_DIR/.git" ]; then
  echo "[DEPLOY] Actualizando repositorio..."
  cd "$APP_DIR" && git pull origin main
else
  echo "[DEPLOY] Clonando repositorio..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

cd "$APP_DIR"

# 2. Verificar Docker
if ! command -v docker &> /dev/null; then
  echo "[DEPLOY] Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  echo "[DEPLOY] IMPORTANTE: Cierra y vuelve a abrir la sesión SSH, luego vuelve a correr ./deploy.sh"
  exit 0
fi

# 3. Verificar Docker Compose
if ! docker compose version &> /dev/null; then
  echo "[DEPLOY] Instalando Docker Compose plugin..."
  sudo apt-get install -y docker-compose-plugin 2>/dev/null || \
  sudo yum install -y docker-compose-plugin 2>/dev/null || true
fi

# 4. Crear directorio de logs
mkdir -p "$APP_DIR/backend/logs"

# 5. Detener contenedores anteriores (si existen)
docker compose down --remove-orphans 2>/dev/null || true

# 6. Build y arranque
echo "[DEPLOY] Construyendo imágenes..."
docker compose build --no-cache

echo "[DEPLOY] Iniciando contenedores..."
docker compose up -d

# 7. Mostrar IP
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ""
echo "======================================================"
echo " ✅  Despliegue completo"
echo "     App: http://${PUBLIC_IP}:5173"
echo "     API: http://${PUBLIC_IP}:3000/health"
echo "======================================================"
