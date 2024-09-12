import Container from 'typedi';
import { UserService } from '../services/user.service';
import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import {
  EmailInUseError,
  InvalidEmailPasswordError,
  UnauthorizedError,
} from '../utils/customError';
import httpStatus from 'http-status';
import { sendTokenResponse } from '../utils/tokenResponse';
import { REDIS_KEYS } from '../utils/redisKeyManager';
import { redisClient } from '../redis';
import sanitizeUser from '../utils/sanitizeUser';

const userService = Container.get(UserService);

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName, username } = req.body;

    const userExists = await userService.getUserByEmail(email);
    if (userExists) return next(new EmailInUseError());

    const user = await userService.addUser({
      email,
      password,
      firstName,
      lastName,
      username,
    });
    sendTokenResponse(user, httpStatus.CREATED, res);
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return next(new InvalidEmailPasswordError());
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new InvalidEmailPasswordError());

    const userKey = REDIS_KEYS.user(String(user._id));

    await redisClient.set(userKey, JSON.stringify(sanitizeUser(user)));

    sendTokenResponse(user, 200, res);
  }
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user._id) return next(new UnauthorizedError());

    const user = await userService.getUserById(String(req.user._id));
    if (!user) {
      return next(new UnauthorizedError());
    }

    const users = await userService.getUsers();
    return res.status(200).json({ success: true, users });
  }
);

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id; // Assuming user ID is attached to the request by the protect middleware

    if (!userId) {
      return next(new UnauthorizedError());
    }

    const userKey = REDIS_KEYS.user(String(userId));
    const cachedUser = await redisClient.get(userKey);
    if (cachedUser) {
      return res.json({ success: true, data: JSON.parse(cachedUser) });
    }

    const user = await userService.getUserById(String(userId));
    if (!user) {
      return next(new UnauthorizedError());
    }

    await redisClient.set(userKey, JSON.stringify(user));

    return res.json({ success: true, data: sanitizeUser(user) });
  }
);
