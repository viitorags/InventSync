FROM php:8.5-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip git libpng-dev libzip-dev zip \
    libonig-dev libxml2-dev libcurl4-openssl-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        bcmath \
        gd \
        zip \
        mbstring \
        xml \
        curl \
        fileinfo

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
RUN cp .env.example .env || true
RUN composer install --optimize-autoloader --no-dev --no-interaction --no-scripts
RUN mkdir -p storage/logs

RUN usermod -u 1000 www-data
RUN chown -R www-data:www-data storage bootstrap/cache

CMD sh -c "php artisan key:generate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"
