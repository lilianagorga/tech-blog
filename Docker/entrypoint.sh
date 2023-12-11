#!/bin/zsh

echo "Current environment: $APP_ENV"
echo "Database connection: $(php artisan tinker --execute='echo config("database.default");')"

until mysqladmin ping -h"database" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent; do
    echo "Waiting for database.."
    sleep 5
done
echo "Local database is ready"

until mysqladmin ping -h"database_testing" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --silent; do
    echo "Waiting for testing database..."
    sleep 5
done
echo "Testing database is ready!"

if [ ! -f "vendor/autoload.php" ]; then
  composer install --no-progress --no-interaction
fi

if [ ! -f ".env" ]; then
    echo "Creating env file for env $APP_ENV"
    cp .env.example .env
else
  echo "env file exists."
fi

if [ ! -f ".env.testing" ]; then
        echo "Creating .env.testing file for environment: $APP_ENV"
        cp .env.testing.example .env.testing
    else
        echo ".env.testing file exists."
fi

role=${CONTAINER_ROLE:-app}

if [ "$role" = "app" ]; then
    php artisan migrate
    php artisan cache:clear
    php artisan config:clear
    php artisan migrate --env=testing
    php artisan key:generate
    php artisan cache:clear
    php artisan config:clear
    php artisan config:cache
    php artisan view:clear
    php artisan route:cache
    php artisan serve --port=$PORT --host=0.0.0.0 --env=.env
    exec docker-php-entrypoint "$@"
elif [ "$role" = "queue" ]; then
    echo "Running the queue ..."
    php /var/www/artisan queue:work --verbose --tries=3 --timeout=180
fi


