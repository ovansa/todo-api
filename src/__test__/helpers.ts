import { Server } from 'http';
import mongoose from 'mongoose';
import request from 'supertest';

import { MongoMemoryServer } from 'mongodb-memory-server';
import log from '../utils/logger';
import { IUser } from '../models/user.model';

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
      await mongoose.connection.db.dropDatabase();
    } catch (error) {
      log.error('Error clearing database:', error);
      throw error;
    }
  } else {
    log.error('Mongoose is not connected');
  }
};

export const loginUser = async (
  user: IUser,
  server: Server
): Promise<string> => {
  const body = {
    email: user.email,
    password: user.password,
  };

  const response = await request(server).post('/login').send(body);
  return response.body.token;
};
