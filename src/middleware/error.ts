import express, { NextFunction } from 'express';

import CustomError from '../utils/customError';

const errorResponse = (
  err: CustomError,
  _req: express.Request,
  res: express.Response,
  _next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    // const message = 'Invalid ID format.';
    const message = 'Resource not found.';
    error = new CustomError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error.',
  });
};

export default errorResponse;
