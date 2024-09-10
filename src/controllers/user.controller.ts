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
