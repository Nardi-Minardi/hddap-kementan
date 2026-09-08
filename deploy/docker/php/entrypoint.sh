#!/bin/sh
set -e

APP_SOURCE="/application"
APP_ROOT="/var/www/html"
export APP_ROOT

if [ ! -f "${APP_ROOT}/artisan" ]; then
    echo "[entrypoint] Initializing application volume..."
    cp -a "${APP_SOURCE}/." "${APP_ROOT}/"
fi

/usr/local/bin/laravel-setup.sh

if [ -n "${DB_HOST:-}" ]; then
    echo "[entrypoint] Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT:-5432}..."
    until php -r "
        \$host = getenv('DB_HOST');
        \$port = getenv('DB_PORT') ?: '5432';
        \$db = getenv('DB_DATABASE');
        \$user = getenv('DB_USERNAME');
        \$pass = getenv('DB_PASSWORD');
        try {
            new PDO(\"pgsql:host=\$host;port=\$port;dbname=\$db\", \$user, \$pass);
            exit(0);
        } catch (Throwable \$e) {
            exit(1);
        }
    "; do
        sleep 2
    done
    echo "[entrypoint] PostgreSQL is ready."
fi

if [ "${RUN_SETUP:-false}" = "true" ] && [ "$1" = "php-fpm" ]; then
    if [ ! -f "${APP_ROOT}/.env" ]; then
        echo "[entrypoint] Creating .env file..."
        if [ -f "${APP_SOURCE}/.env.example" ]; then
            cp "${APP_SOURCE}/.env.example" "${APP_ROOT}/.env"
        else
            touch "${APP_ROOT}/.env"
        fi
    fi

    if ! grep -qE '^APP_KEY=base64:.+' "${APP_ROOT}/.env" 2>/dev/null; then
        echo "[entrypoint] Generating APP_KEY..."
        php "${APP_ROOT}/artisan" key:generate --force
    fi

    if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
        echo "[entrypoint] Running migrations..."
        if ! php "${APP_ROOT}/artisan" migrate --force; then
            echo "[entrypoint] ERROR: migration gagal. Cek log di atas."
            exit 1
        fi
    fi

    if [ "${APP_ENV:-local}" = "production" ]; then
        echo "[entrypoint] Caching config, routes, views..."
        php "${APP_ROOT}/artisan" config:cache || echo "[entrypoint] WARN: config:cache gagal, lanjut..."
        php "${APP_ROOT}/artisan" route:cache || echo "[entrypoint] WARN: route:cache gagal, lanjut..."
        php "${APP_ROOT}/artisan" view:cache || echo "[entrypoint] WARN: view:cache gagal, lanjut..."
    fi
fi

exec "$@"
