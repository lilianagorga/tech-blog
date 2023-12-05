FROM php:8.2.1 as php

RUN apt-get update -y \
    && apt-get install -y unzip libpq-dev libcurl4-gnutls-dev zsh
RUN docker-php-ext-install pdo pdo_mysql bcmath

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

RUN echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" > /usr/local/etc/php/conf.d/xdebug.ini
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/xdebug.ini
RUN echo "xdebug.client_port=8082" >> /usr/local/etc/php/conf.d/xdebug.ini
RUN echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/xdebug.ini


WORKDIR /var/www
COPY . .

COPY --from=composer:2.6.2 /usr/bin/composer /usr/bin/composer

ENV PORT=8000

ENTRYPOINT ["Docker/entrypoint.sh"]


FROM node:current-alpine3.17 as node

WORKDIR /var/www
COPY . .

RUN npm install

VOLUME /var/www/node_modules
