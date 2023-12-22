FROM php:8.2.1 as php

RUN apt-get update -y \
    && apt-get install -y unzip libpq-dev libcurl4-gnutls-dev tzdata nano zsh default-mysql-client iputils-ping && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update -y \
    && apt-get install -y iputils-ping \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_mysql mysqli bcmath
RUN docker-php-ext-enable pdo_mysql mysqli


RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

WORKDIR /var/www
COPY . .

COPY --from=composer:2.6.2 /usr/bin/composer /usr/bin/composer

ENV PORT=8000

ENTRYPOINT ["Docker/entrypoint.sh"]


FROM node:current-alpine3.17 as node

WORKDIR /var/www/vite-with-react
COPY vite-with-react/package*.json ./

RUN npm install

COPY vite-with-react/ ./
