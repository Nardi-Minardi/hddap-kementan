#!/bin/sh
set -e

APP_ROOT="${APP_ROOT:-/var/www/html}"
WEB_USER="${WEB_USER:-www-data}"
WEB_GROUP="${WEB_GROUP:-www-data}"

echo "[laravel-setup] Preparing storage & bootstrap directories..."

mkdir -p \
    "${APP_ROOT}/storage/app/public" \
    "${APP_ROOT}/storage/framework/cache/data" \
    "${APP_ROOT}/storage/framework/sessions" \
    "${APP_ROOT}/storage/framework/views" \
    "${APP_ROOT}/storage/logs" \
    "${APP_ROOT}/bootstrap/cache"

if [ "$(id -u)" = "0" ]; then
    echo "[laravel-setup] Setting ownership ${WEB_USER}:${WEB_GROUP}..."
    chown -R "${WEB_USER}:${WEB_GROUP}" "${APP_ROOT}/storage" "${APP_ROOT}/bootstrap/cache"
    chmod -R ug+rwx "${APP_ROOT}/storage" "${APP_ROOT}/bootstrap/cache"
fi

LINK="${APP_ROOT}/public/storage"
TARGET="../storage/app/public"

if [ -e "${LINK}" ] && [ ! -L "${LINK}" ]; then
    echo "[laravel-setup] Removing invalid public/storage (bukan symlink)..."
    rm -rf "${LINK}"
fi

if [ -L "${LINK}" ] && [ ! -e "${LINK}" ]; then
    echo "[laravel-setup] Removing broken symlink public/storage..."
    rm -f "${LINK}"
fi

echo "[laravel-setup] Running php artisan storage:link --force..."
php "${APP_ROOT}/artisan" storage:link --force

if [ -L "${LINK}" ]; then
    echo "[laravel-setup] Symlink OK: public/storage -> $(readlink "${LINK}")"
else
    echo "[laravel-setup] ERROR: gagal membuat symlink public/storage"
    exit 1
fi

echo "[laravel-setup] Selesai."
