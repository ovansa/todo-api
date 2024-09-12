import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

import { config } from './config';
import errorResponse from './middleware/error';
import router from './routes';

export const createServer = (): Application => {
  const app: express.Express = express();

  app.use(
    cors({
      credentials: true,
    }),
  );
  app.use(express.json());

  if (config.env === 'development') {
    app.use(morgan('combined'));
  }

  app.use('/', router());

  app.use(errorResponse);

  return app;
};
