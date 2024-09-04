class CustomError extends Error {
  statusCode: number;
  message: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class TodoTitleRequiredError extends CustomError {
  constructor() {
    super('Todo title is required.', 400);
  }
}

export class TodoNotFoundError extends CustomError {
  constructor() {
    super('Todo not found.', 404);
  }
}

export class RequestDataCannotBeEmptyError extends CustomError {
  constructor() {
    super('Request data cannot be empty.', 400);
  }
}

export default CustomError;
