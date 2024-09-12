import { Server } from 'http';

import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { IUser } from '../models/user.model';
import log from '../utils/logger';

let mongoServer: MongoMemoryServer;

export const connectTestMongoDb = async () => {
  mongoServer = await MongoMemoryServer.create();
};

export const disconnectTestMongoDb = async () => {
  mongoServer.stop();
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose?.connection?.db?.dropDatabase();
    } catch (error) {
      log.error('Error clearing database:', error);
      throw error;
    }
  } else {
    log.error('Mongoose is not connected');
  }
};

export const loginUser = async (user: IUser, server: Server): Promise<string> => {
  const body = {
    email: user.email,
    password: user.password,
  };

  const response = await request(server).post('/login').send(body);
  return response.body.token;
};

export const simulateLogin = (user: IUser): string => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, 'SOMETHING_SECRETIVE', {
    expiresIn: 10,
  });

  return token;
};
