import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import errorResponse from './middleware/error';

import router from './routes';

const MONGO_URL = `mongodb://localhost:27017/todo-api`;
const app: Application = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => console.log('DB Connected'));
mongoose.connection.on(`error`, (error: Error) => console.log(error));

app.use('/', router());

app.use(errorResponse);
