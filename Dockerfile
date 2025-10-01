FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libonig-dev libxml2-dev libzip-dev zlib1g-dev \
    libpng-dev libjpeg-dev libfreetype6-dev curl nginx supervisor mariadb-client \
    && docker-php-ext-install intl pdo pdo_mysql mbstring zip gd opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

RUN rm /etc/nginx/sites-enabled/default
COPY ./docker/nginx/symfony.conf /etc/nginx/conf.d/default.conf

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html

COPY . .

RUN composer install --no-interaction --optimize-autoloader

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
