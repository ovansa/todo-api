import 'reflect-metadata';
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import errorResponse from './middleware/error';

import router from './routes';
import logger from './utils/logger';

dotenv.config();

const MONGO_DEFAULT = `mongodb://localhost:27017/todo-api`;
let MONGO_URL = process.env.MONGO_URL || MONGO_DEFAULT;
logger.info(`process ${process.env.MONGO_URL}`);
const app: Application = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
  MONGO_URL = MONGO_DEFAULT;
}

if (process.env.NODE_ENV === 'test') {
  MONGO_URL = MONGO_DEFAULT;
}

const server = app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000.');
});

mongoose.Promise = Promise;

mongoose
  .connect(MONGO_URL)
  .then(() => logger.info(`DB Connected. ${new URL(MONGO_URL).host}`));
mongoose.connection.on(`error`, (error: Error) => logger.error(error));

app.use('/', router());

app.use(errorResponse);

export { server };
