import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

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
      console.error('Error clearing database:', error);
      throw error;
    }
  } else {
    console.error('Mongoose is not connected');
  }
};
