import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/customError';
import Container from 'typedi';
import { UserService } from '../services/user.service';
import { TokenPayload } from '../types/tokenPayload';

const userService = Container.get(UserService);

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  console.log(`token`, token);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(`token auth`, req.headers.authorization);
  console.log(`token after`, token);

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const secret = String(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const user = await userService.getUserById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError());
  }
};

export default protect;
