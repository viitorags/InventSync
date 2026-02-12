#!/usr/bin/env bash

apt-get update
apt-get install -y php-cli php-common php-mbstring php-curl php-dom php-zip php-bcmath php-xml php-redis

curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan key:generate --show
php artisan migrate
