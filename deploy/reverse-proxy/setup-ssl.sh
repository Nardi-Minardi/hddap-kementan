#!/bin/sh
set -e

DOMAIN="hddap.cloud"
EMAIL="${CERTBOT_EMAIL:-admin@hddap.cloud}"
PROJECT_DIR="/home/hddap"
CERTS_DIR="${PROJECT_DIR}/reverse-proxy/certs"
WEBROOT="${PROJECT_DIR}/reverse-proxy/certbot/www"

mkdir -p "${CERTS_DIR}" "${WEBROOT}"

echo "[1/6] Stop reverse proxy sementara (port 80 harus kosong)..."
cd "${PROJECT_DIR}/reverse-proxy"
docker compose down

echo "[2/6] Generate sertifikat Let's Encrypt..."
if ! command -v certbot >/dev/null 2>&1; then
    apt-get update && apt-get install -y certbot
fi

certbot certonly --standalone \
    -d "${DOMAIN}" \
    -d "www.${DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos \
    --non-interactive

echo "[3/6] Copy sertifikat ke folder reverse-proxy/certs ..."
cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem "${CERTS_DIR}/fullchain.pem"
cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem "${CERTS_DIR}/privkey.pem"
chmod 644 "${CERTS_DIR}/fullchain.pem"
chmod 600 "${CERTS_DIR}/privkey.pem"

echo "[4/6] Start reverse proxy dengan HTTPS..."
docker compose up -d

echo "[5/6] Update APP_URL ke https (jika belum)..."
if grep -q '^APP_URL=' "${PROJECT_DIR}/.env"; then
    sed -i 's|^APP_URL=.*|APP_URL=https://hddap.cloud|' "${PROJECT_DIR}/.env"
else
    echo 'APP_URL=https://hddap.cloud' >> "${PROJECT_DIR}/.env"
fi

echo "[6/6] Restart app agar APP_URL terbaca..."
cd "${PROJECT_DIR}"
docker compose restart app nginx queue scheduler

echo ""
echo "Selesai! Test: curl -I https://${DOMAIN}"
echo "Renew manual: ${PROJECT_DIR}/reverse-proxy/renew-ssl.sh"
