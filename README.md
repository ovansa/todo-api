# Todo Application

This is a Node.js-based Todo Application that manages tasks with CRUD operations. The project uses TypeScript, MongoDB, Mongoose, and Express to create a robust backend API for handling todos, including features like authentication, role-based access control, and filtering.

## Features

- **CRUD Operations**: Create, read, update, and delete todo items.
- **Role-based Access Control**:
  - Admins can access all todos.
  - Regular users can access only their own todos.
- **Filtering**: Todos can be filtered by status and sorted by specific fields.
- **Pagination**: Efficiently handles large datasets with pagination.
- **User Authentication**: Secures the API with JWT-based authentication.
- **Owner Validation**: Middleware to ensure only owners can modify their todos.

## Tech Stack

- **Node.js** with **Express** for backend logic.
- **TypeScript** for static typing.
- **MongoDB** and **Mongoose** for data storage and modeling.
- **JWT** for authentication and authorization.
- **Faker.js** for generating mock data in development.
- **Pino** for logging.
- **Mongoose Memory Server** for in-memory testing.

## Endpoints

- `POST /todos`: Create a new todo.
- `GET /todos`: Get a list of todos (admins can fetch all, users can fetch their own).
- `PUT /todos/:id`: Update a specific todo (only the owner can update).
- `DELETE /todos/:id`: Delete a specific todo (only the owner can delete).

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables in a `.env` file:
   ```bash
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
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

- **Protect**: Ensures a valid JWT token for authentication.
- **isOwner**: Verifies the user owns the todo resource they are attempting to access.

## Mock Data Generation

Use `faker.js` to generate mock data for development. You can find the logic in the `mock-generator.ts` file for generating users and todos.

## License

This project is licensed under the MIT License.

---

You can expand sections as needed, but this provides a concise and informative overview.
