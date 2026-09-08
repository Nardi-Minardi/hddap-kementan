# syntax=docker/dockerfile:1

FROM composer:2 AS vendor

WORKDIR /app

COPY hddap-kementan/composer.json hddap-kementan/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY hddap-kementan/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

FROM node:20-alpine AS frontend

WORKDIR /app

COPY hddap-kementan/package.json hddap-kementan/package-lock.json ./
RUN npm ci

COPY hddap-kementan/resources ./resources
COPY hddap-kementan/public ./public
COPY hddap-kementan/vite.config.js hddap-kementan/postcss.config.js hddap-kementan/tailwind.config.js hddap-kementan/jsconfig.json ./

COPY --from=vendor /app/vendor ./vendor

RUN npm run build

FROM php:8.3-fpm-bookworm AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        zip \
        gd \
        bcmath \
        pcntl \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-hddap.ini
COPY docker/php/laravel-setup.sh /usr/local/bin/laravel-setup.sh
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/laravel-setup.sh /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

COPY --from=vendor /app /application
COPY --from=frontend /app/public/build /application/public/build

RUN mkdir -p /application/storage/framework/{cache,sessions,views} \
    /application/storage/logs \
    /application/bootstrap/cache \
    && chown -R www-data:www-data /application/storage /application/bootstrap/cache

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
