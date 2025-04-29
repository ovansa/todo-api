import User from './models/user.model';
import { config } from './config';
import createUsersWithTodos from './scripts/createUsersWithTodos';
import logger from './utils/logger';
import mongoose from 'mongoose';

const MONGO_DEFAULT = `mongodb://localhost:27017/todo-apis`;

export const connectDB = async () => {
  const MONGO_URL =
    config.env === 'test' || config.env === 'development' ? MONGO_DEFAULT : config.mongoUrl;

  try {
    mongoose.Promise = Promise;
    await mongoose.connect(MONGO_URL);
    logger.info(`✅ DB Connected: ${new URL(MONGO_URL).host}`);
  } catch (error) {
    logger.error('❌ DB Connection failed:', error);
    process.exit(1); // Exit if DB connection fails
  }
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
