import mongoose from 'mongoose';

import User from './models/user.model';

import { config } from './config';
import logger from './utils/logger';
import createUsersWithTodos from './scripts/createUsersWithTodos';

const MONGO_DEFAULT = `mongodb://localhost:27017/todo-apis`;

export const connectDB = async () => {
  const MONGO_URL =
    config.env === 'test' || config.env === 'development' ? MONGO_DEFAULT : config.mongoUrl;

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL).then(() => logger.info(`DB Connected: ${new URL(MONGO_URL).host}`));
  mongoose.connection.on(`error`, (error: Error) => logger.error(error));
};

export const createTestData = async () => {
  try {
    if (config.env !== 'test') {
      const userCount = await User.countDocuments();

      if (userCount <= 1) {
        logger.info('No users found in the database. Creating test data...');
        await createUsersWithTodos();
        logger.info('✅ Test data created successfully.');
      } else {
        logger.info('Test data already exists. Skipping data creation.');
      }
    }
  } catch (error) {
    logger.error('❌ Error creating test data:', error);
  }
};
