import 'reflect-metadata';
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import errorResponse from './middleware/error';

import router from './routes';
import logger from './utils/logger';

const MONGO_URL = `mongodb://localhost:27017/todo-api`;
const app: Application = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

const server = app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000.');
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => logger.info('DB Connected.'));
mongoose.connection.on(`error`, (error: Error) => logger.error(error));

app.use('/', router());

app.use(errorResponse);

export { server };
