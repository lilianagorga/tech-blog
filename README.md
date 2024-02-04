# Overview

Tech-blog is a full-stack API designed as a part of my portfolio and represents an integration of Laravel and React 
within a Docker-based environment. This API leverages the Laravel framework to handle backend operations, serving a 
variety of entities such as posts, categories, comments, and votes integrated within a dynamic web interface. On the
frontend, the project utilizes the React framework powered by Vite.

The blog features two main components: the Home page  and the Manage Panel. The Home page offers users the ability
to interact with categories, posts, comments, and votes. Users can click on a category to view posts associated with it
and can create posts with the option to associate them with existing categories or not. They can also engage with 
comments and votes tied to these posts. The Manage Panel, accessible only to users granted the managePanel permission, 
is a specialized area designed for role and permission management. Utilizing the Spatie package, this panel allows for 
the creation, deletion, update, revoke and assignment of roles and permissions exclusively by the admin. The Manage Panel
features also a specific section dedicated to category management, accessible only to users with the appropriate permission.

This API showcases the flexibility of combining Laravel and React within a Docker-based environment, making it an 
example of a full-stack development project.

Please feel free to let me know if any further refinements or adjustments are needed.

# Database and Model associations

A Post belongs to many Category, belongs to a User and has many Vote.
A Category belongs to many Post and belongs to a User.
A User has many courses and many subjects.
A Comment belongs to User and Post.
A Vote belongs to Post.

# Testing

A Minimum Viable Product (MVP) was initially created and tested. With each subsequent feature implementation, 
the suite of automated tests was expanded to cover new scenarios.

Testing has been integrated into the Docker-based development environment. Feature tests for the backend are available 
within the dedicated Docker container. This is a separate database container database_testing is configured specifically
for testing purposes to prevent any interference with the development or production databases.

## Technologies Used

* Docker
* Laravel framework
* React framework
* laravel/sanctum
* xdebug
* Spatie
* Vite
* Tailwindcss
* postcss
* laravel-vite-plugin

## Follow these steps to try the REST API in your local environment

1. Run the following command to clone the repository:

```bash
git clone https://github.com/lilianagorga/tech-blog.git
```

2. Once the repository is cloned, navigate to the project folder:

```bash
cd tech-blog
```

3. Install composer dependencies:

```bash
composer install
```

4. Install NPM Dependencies:

```bash
npm install
```

5. Run Vite to build the frontend assets:

```bash
npm run dev
```

* This will compile and optimize the frontend assets.

6. Database Setup:

* Create an empty database on your local MySQL server using tools such as MySQL Workbench, phpMyAdmin.
* Run the database migrations with:

```bash
php artisan migrate
```

* Seed the database with test data using:

```bash
php artisan db:seed
```

7. Database Setup for testing:

* If you're setting up the testing database, make sure to configure the `.env.testing` file with the appropriate
  database settings. Then, follow these steps:

* Run the database migrations for testing using:

```bash
php artisan migrate --env=testing
```

* Seed the testing database with test data using:

```bash
php artisan db:seed --env=testing
```

8. Start the local development server:

```bash
php artisan serve
```

9. You are now ready to use the e-teach-hub API on your local environment: http://localhost:8000


## Follow these steps to try the REST API in Docker Environment Setup

1. Ensure Docker and Docker Compose are installed on your system.

2. Clone the repository using the command:

```bash
git clone https://github.com/lilianagorga/tech-blog.git
```

3. Once the repository is cloned, navigate to the project folder:

```bash
cd tech-blog
```

4. Build and run the containers using Docker Compose:

```bash
docker-compose up -d --build
```
- This command will download all the necessary Docker images, build your containers, and run them in detached mode.
- It runs also the necessary migrations for both the development and testing databases. 
- The `entrypoint.sh` script will execute these commands as part of the container startup process.
- Make sure to configure the `.env.testing` file with the appropriate database settings.

5. After the containers are up and running, seed the development and testing database:

```bash
docker-compose exec php php artisan db:seed
docker-compose exec php php artisan db:seed --env=testing
```

6. Ensure the Laravel .env file has the correct settings for Redis:

```bash
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

7. Ensure the Laravel .env file has the correct settings for database:

```bash
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
```

8. Ensure the Laravel .env.testing file has the correct settings for database_testing:

```bash
DB_CONNECTION=mysql
DB_HOST=database_testing
DB_PORT=3306
```

9. To execute feature tests within the Docker environment, use the following command:

```bash
docker-compose exec php php artisan test
```
- This will run the test suite against the dedicated testing database within the database_testing service.

10. The entire application is accessible at http://localhost:3000 due to the configuration of the axios client in the 
React application, which is set to interact with the backend API at http://localhost:8000/api. 
- To start the frontend React server, access the Node container:

```bash
docker-compose exec node sh
```
- Then, for the initial setup, you might need to run:

```bash
npm run build
npm run dev
```
- For subsequent runs, use:

```bash
npm run dev
```

11. By following these steps, you will have a fully functional local setup of the tech-blog API running inside Docker
containers. Remember to shut down your Docker containers when you're done:

```bash
docker-compose down
```

## Usage

Recommended tool to try the requests. [Postman](https://www.postman.com/)

tech-blog API secures its endpoints using Laravel Sanctum, which provides a simple and lightweight system for API 
token authentication. This ensures that all operations performed on sensitive routes such as `/post*`, `/categories*`, 
`/users*`, `/roles*`, `/permissions*`, `/comments*`, and `/votes*` are authenticated and authorized.

The following is an example flow of operations can might perform:
1. An admin creates a set of roles and permissions that define access levels within the tech-blog. 
2. A new user registers via the `/api/user/register` endpoint. 
3. The admin assigns a 'Writer' role to the new user, which includes permission to create categories. 
4. The user creates a new category via the `/api/categories` endpoint. 
5. The user then creates a new post, associating it with the newly created category. 
6. Other users engage with the post by adding comments and votes.

### Routes API

Authentication:
- **POST** /user/register
- **POST** /user/login
- **POST** /logout

Management Users, Posts and Categories:
- **RESOURCE** /posts
- **RESOURCE** /categories
- **RESOURCE** /users
- **GET** /me: Get the details of the currently authenticated user.
- **GET** /search: Search posts by title or content. 
- **GET** /category/{category:slug}: Get posts by category slug.

Comments:
- **GET** /comments
- **GET** /posts/{postId}/comments: Get all comments for a specific post.
- **POST** /comments
- **PATCH** /comments/{comment}
- **DELETE** /comments/{comment}

Votes: 
- **POST** /votes/{type} 
- **PATCH** /votes/{voteId} 
- **DELETE** /votes/{voteId}

Management Roles and Permissions:
- **POST** /roles 
- **PUT** /roles 
- **DELETE** /roles/delete 
- **POST** /roles/assign 
- **POST** /roles/revoke 
- **POST** /permissions 
- **DELETE** /permissions/delete 
- **POST** /permissions/assign 
- **POST** /permissions/revoke

- **GET** /home: Retrieve home page content.

### Routes Web

- The web routes are designed to ensure that the React frontend is served correctly when the application is run outside 
  of Docker, such as during local development.
- When running locally without Docker, the Laravel server needs to handle requests for your React application. Since all
  API routes are prefixed with `/api`, we need a way to serve the React application for all other requests. This is 
  where the catch-all route comes into play:
  
 ```php
Route::get('/{any}', function () {
    return file_get_contents(public_path('build/index.html'));
})->where('any', '^(?!api).*$');
```

- This snippet in the web routes (routes/web.php) tells Laravel to respond with the index.html of your React application 
  for any route that does not start with /api. This way, when you access your application at http://localhost:8000
  Laravel will serve the index.html file, and React Router will handle the rest.

> **Remember to include the following headers when making requests:**
> Check on the headers tab **Content/type** application/json.
> Add a new header **Accept** application/json.
> Authorization: **Bearer** {token}

### Filtering Posts

* The `posts` API route supports filtering based on different parameters. Below are the ways you can filter posts :
* General Post Filtering (/api/posts)
  - Category Filtering: Add a category query parameter to filter posts by category slug. 
    This utilizes a relationship check within the categories table to match posts to the specified category. 
  - User Filtering: Use the user_id query parameter to filter posts created by a specific user.
  - Keyword Search: The q query parameter allows for keyword search within the post's title and body.
  - Sorting: Posts can be sorted by any column using the sort parameter. Use the order parameter to specify the sorting
    order (asc or desc). By default, posts are sorted by their published_at date in descending order.
  
* Filtering by Category (/api/category/{category:slug})
  - This route filters posts associated with a specific category. The method utilizes the pivot table category_post to 
    retrieve posts belonging to the given category slug. A keyword search can also be performed within this filtered 
    list by providing the q query parameter.

* Search Functionality (/api/search)
  - The search functionality allows users to perform a broad search across all active posts that have been published. 
    By using the q query parameter, the API will return posts where the keyword appears in the title or body of the post.

* Example Requests
  Filtering by category: `/api/posts?category=Backend`
  Filtering by user: `/api/posts?user_id=1`
  Keyword search: `/api/posts?q=laravel`
  Sorting posts: `/api/posts?sort=title&order=asc`

* All filtered routes return paginated results, with a default of 10 posts per page.

* This will return a JSON response with the filtered courses that match the specified criteria.

## Contributing

We welcome contributions to make this app even better. If you'd like to contribute, follow these steps:

* Fork the project.

* Create your feature branch:

```bash
git checkout -b feature-name
```

* Commit your changes:

```bash
git commit -m 'Description of the feature'
```

* Push to the branch:

```bash
git push origin feature-name
```

* Open a pull request.

## Live Deploy
* The application will be accessible at http://techblogproduction.lilianagorga.com/

## License

This API is licensed under the [MIT license](https://opensource.org/licenses/MIT).
