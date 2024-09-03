import express, { NextFunction } from 'express';
import CustomError from '../utils/customError';

const errorResponse = (
  err: CustomError,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error.',
  });
};

export default errorResponse;
