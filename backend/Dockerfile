FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git

RUN docker-php-ext-install gd mysqli pdo pdo_mysql bcmath zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
RUN composer install --optimize-autoloader --no-dev
RUN mkdir -p storage/logs

RUN usermod -u 1000 www-data
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=$PORT"]
