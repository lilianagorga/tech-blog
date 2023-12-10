docker-compose up -d database_testing
docker-compose exec php php artisan test
docker-compose stop database_testing
