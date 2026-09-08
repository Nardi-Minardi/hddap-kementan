#!/bin/sh
set -e

DOMAIN="hddap.cloud"
PROJECT_DIR="/home/hddap"
CERTS_DIR="${PROJECT_DIR}/reverse-proxy/certs"

echo "Renew sertifikat SSL..."
cd "${PROJECT_DIR}/reverse-proxy"
docker compose down

certbot renew --quiet

cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem "${CERTS_DIR}/fullchain.pem"
cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem "${CERTS_DIR}/privkey.pem"
chmod 644 "${CERTS_DIR}/fullchain.pem"
chmod 600 "${CERTS_DIR}/privkey.pem"

docker compose up -d
docker exec hddap-reverse-proxy nginx -s reload 2>/dev/null || true

echo "Renew selesai."
