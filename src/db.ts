import mongoose from 'mongoose';
import logger from './utils/logger';
import { config } from './config';

const MONGO_DEFAULT = `mongodb://localhost:27017/todo-api`;

export const connectDB = async () => {
  const MONGO_URL = config.env === 'test' ? MONGO_DEFAULT : config.mongoUrl;

  mongoose.Promise = Promise;
  mongoose
    .connect(MONGO_URL)
    .then(() => logger.info(`DB Connected. ${new URL(MONGO_URL).host}`));
  mongoose.connection.on(`error`, (error: Error) => logger.error(error));
};
