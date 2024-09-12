import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import Container from 'typedi';

import { redisClient } from '../redis';
import { UserService } from '../services/user.service';
import { TokenPayload } from '../types/tokenPayload';
import { ResourceNotFoundError, UnauthorizedError } from '../utils/customError';
import { REDIS_KEYS } from '../utils/redisKeyManager';
import { resourceModelMapping, ResourceModels } from '../utils/resourceModel';
import logger from '../utils/logger';
import asyncHandler from './async';

const userService = Container.get(UserService);

export const isOwner = (resource: ResourceModels) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const resourceModel = resourceModelMapping[resource];

    if (!resourceModel) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Invalid resource model' });
    }

    const resourceData = await resourceModel.findById(resourceId);
    if (!resourceData) return next(new ResourceNotFoundError());

    if (String(resourceData.createdBy) !== String(req?.user?._id)) {
      return next(new ResourceNotFoundError());
    }

    next();
  });

const protect = async (req: Request, _res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const secret = String(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, secret) as TokenPayload;

    const userKey = REDIS_KEYS.user(String(decoded._id));
    const cachedUser = await redisClient.get(userKey);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    const user = await userService.getUserById(decoded._id);
    if (!user) {
      return next(new UnauthorizedError());
    }

    await redisClient.set(userKey, JSON.stringify(user));
    req.user = user;

    next();
  } catch (error) {
    logger.error(error);
    return next(new UnauthorizedError());
  }
};

export default protect;
