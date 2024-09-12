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

## Redis Setup

The application uses Redis for caching user profiles to reduce database load and improve response times. Here's a summary of the Redis setup:

- **Redis Host**: Configured based on the environment (`development`, `test`, or production).
- **Redis Port**: Default to `6379` unless overridden.
- **Redis Password**: Set based on environment configuration.
- **Caching Behavior**:
  - **Set**: User profile data is cached in Redis with a default expiration time of 3600 seconds (1 hour).
  - **Get**: The `GET /profile` endpoint first checks Redis cache before querying the database. If the profile is not found in Redis, it falls back to the database.
  - **Delete**: Handles cache invalidation if needed.
  - **Error Handling**: Includes error logging for Redis operations.

The Redis setup helps in quickly retrieving user profile data by reducing database lookups and improving overall application performance.

## Endpoints

### User Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Log in a user and return a JWT token.
- `GET /profile`: Get the logged-in user’s profile. This endpoint first checks Redis cache before querying the database.

### Todo Endpoints

- `POST /todo`: Create a new todo.
- `GET /todo`: Get a list of todos (admins can fetch all, users can fetch their own).
- `PUT /todo/:id`: Update a specific todo (only the owner can update).
- `DELETE /todo/:id`: Delete a specific todo (only the owner can delete).

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
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=<your-jwt-expire>
   JWT_COOKIE_EXPIRE=<your-jwt-cookie-expire>
   REDIS_HOST=<your-redis-host>
   REDIS_PORT=<your-redis-port>
   REDIS_PASSWORD=<your-redis-password>
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. To run tests:
   ```bash
   npm test
   ```

## Middleware

- **Protect**: Ensures a valid JWT token for authentication. It utilizes Redis to cache user profiles for performance improvement.
- **isOwner**: Verifies the user owns the todo resource they are attempting to access.

## Mock Data Generation

Use `faker.js` to generate mock data for development. You can find the logic in the `mock-generator.ts` file for generating users and todos.
