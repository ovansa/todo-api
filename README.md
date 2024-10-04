# Todo Application

This is a Node.js-based Todo Application that manages tasks with CRUD operations. The project uses TypeScript, MongoDB, Mongoose, and Express to create a robust backend API for handling todos, including features like user management, authentication, role-based access control, and filtering.

## Features

- **CRUD Operations**: Create, read, update, and delete todo items.
- **User Registration and Authentication**: Users can register and log in, securing access with JWT-based authentication.
- **User Roles**: Role-based access control where:
  - Admins have access to all todos.
  - Regular users can only manage their own todos.
- **Owner Validation**: Middleware ensures that users can only modify their own todos.
- **Filtering & Sorting**: Todos can be filtered by status and sorted by fields like creation date or priority.
- **Pagination**: Efficiently handles large datasets with pagination.
- **Password Hashing & Security**: User passwords are hashed before storage for security.
- **Database Seeding**: If no users exist in the database, it will automatically be seeded with sample data for testing, including a predefined `oneUser`.

## Tech Stack

- **Node.js** with **Express** for backend logic.
- **TypeScript** for static typing.
- **MongoDB** and **Mongoose** for data storage and modeling.
- **JWT** for authentication and authorization.
- **BCrypt.js** for hashing user passwords.
- **Faker.js** for generating mock data in development.
- **Pino** for logging.
- **Mongoose Memory Server** for in-memory testing.
- **Redis** for caching user profiles to improve performance.

## Database Seeding

If the application detects that there are no users in the database, it will automatically seed the database with sample users and todos. This helps set up the environment for testing and development. The first seeded user (`oneUser`) is designed for easy testing and debugging.

### `oneUser` Data:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john.doe@gmail.com",
  "password": "Password0123$",
  "role": "DEFAULT_USER"
}
```

You can use the above credentials for testing the application.

## Docker Setup

The application, MongoDB, and Redis are containerized using Docker Compose. Follow these steps to set up and run the application with Docker.

### Prerequisites

- Docker
- Docker Compose

### Docker Configuration

Ensure you have a `docker-compose.yml` file in the root of your project with the following content:

### Building and Running Containers

1. **Build and start the containers:**

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images (if necessary) and start the containers as defined in the `docker-compose.yml` file.

2. **Run the containers in detached mode (background):**

   ```bash
   docker-compose up -d
   ```

3. **Check the status of the containers:**

   ```bash
   docker-compose ps
   ```

### Stopping Containers

1. **Stop and remove the containers:**

   ```bash
   docker-compose down
   ```

   This command will stop the containers and remove them, along with any associated networks and volumes.

## Accessing MongoDB and Redis

- **MongoDB Compass**: Connect to MongoDB using MongoDB Compass with the connection string `mongodb://localhost:27018/todo-db`.

- **Redis CLI**: Connect to Redis using the Redis CLI with the command:

  ```bash
  redis-cli -p 6380
  ```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ovansa/todo-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables in a `.env` file:
   ```bash
   MONGO_URL=mongodb://localhost:27017/todo-db
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=<your-jwt-expire>
   JWT_COOKIE_EXPIRE=<your-jwt-cookie-expire>
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=<your-redis-password>
   ```
4. Build and run Docker containers:
   ```bash
   docker-compose up --build
   ```
5. To run tests:
   ```bash
   npm test
   ```

## Middleware

- **Protect**: Ensures a valid JWT token for authentication. It utilizes Redis to cache user profiles for performance improvement.
- **isOwner**: Verifies the user owns the todo resource they are attempting to access.

## Mock Data Generation

Use `faker.js` to generate mock data for development. You can find the logic in the `mock-generator.ts` file for generating users and todos. The application will automatically generate sample users and todos in the database if none exist, ensuring the development environment is ready for testing.
