import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config';
import router from './routes';
import errorResponse from './middleware/error';

export const createServer = (): Application => {
  const app: express.Express = express();

  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(express.json());

  if (config.env === 'development') {
    app.use(morgan('combined'));
  }

  app.use('/', router());

  app.use(errorResponse);

  return app;
};
