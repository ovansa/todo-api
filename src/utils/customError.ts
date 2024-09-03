class CustomError extends Error {
  statusCode: number;
  message: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class TodoNameRequiredError extends CustomError {
  constructor() {
    super('Todo name is required.', 400);
  }
}

export class TodoNotFoundError extends CustomError {
  constructor() {
    super('Todo not found.', 400);
  }
}

export default CustomError;
