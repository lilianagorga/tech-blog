# Overview

The frontend interacts with the backend through an axiosClient setup, which is pre-configured with a base URL. 
The router manage navigation with routes defined for public access and restricted administrative areas.

## Key Features
- Context API: State management using React's Context API to manage global state, facilitating the sharing of user data,
  roles, permissions, and UI states across different components without prop drilling.
- Vitest: Testing framework for React components and utilities.
- Layout and Navigation: The DefaultLayout component integrates the navigation bar and provides a structure for 
  displaying the main content alongside it. PageComponent wraps the page content, providing a common header and container
  for the content. This abstraction simplifies the creation of new pages and maintains a consistent layout style.
- Guest Access: The GuestLayout is tailored for unauthenticated or guest users, used for the login and registration 
  views. It acts as a guard, redirecting authenticated users to the main content and providing a focused layout for 
  guest operations. 

## Quick Start in your local environment

1. Navigate to the vite-with-react directory inside the cloned project repository:

```bash
cd vite-with-react
```

2. Install the required npm packages:

```bash
npm install
```

3. Once the installation is complete, you can:

  - Start the development server to work with hot module replacement:

    ```bash
    npm run dev
    ```
    
  - Build the project for production deployment:

  ```bash
  npm run build
  ```

  - Run the test suite:

    ```bash
    npm test
    ```


## Quick Start with Docker
To begin working on the frontend within the Docker environment, follow these steps:

1. Start the Docker containers using Docker Compose from the root of the project repository:

```bash
docker-compose up -d
```

2. Once the containers are running, access the Node container's shell:

```bash
docker-compose exec node sh
```

3. Within the Node container you can perform the following actions:

- The npm install command has already been executed as part of the Docker container build process, so there is no need 
  to run it the first time you access the Node container. However, if you need to update the npm packages or install 
  new ones, you can do so with the following commands:
  - To update the existing packages:
    ```bash
    npm update
    ```
  - To install a new package:

  ```bash
    npm install <package-name>
  ``` 


- Run the development server:

  ```bash
  npm run dev
  ```
  
- Build the project for production:

  ```bash
  npm run build
  ```

- Run tests:

  ```bash
  npm test
  ```

## Contributing 
We encourage contributions and feedback to improve the application. If you encounter any issues or have suggestions for 
enhancements, please feel free to  submit a pull request.
