import mongoose from 'mongoose';

import { config } from './config';
import logger from './utils/logger';

const MONGO_DEFAULT = `mongodb://localhost:27017/todo-api`;

export const connectDB = async () => {
  let MONGO_URL =
    config.env === 'test' || config.env === 'development' ? MONGO_DEFAULT : config.mongoUrl;

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL).then(() => logger.info(`DB Connected: ${new URL(MONGO_URL).host}`));
  mongoose.connection.on(`error`, (error: Error) => logger.error(error));
};
