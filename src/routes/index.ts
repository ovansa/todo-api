import express from 'express';
import todo from './todo.router';
import user from './user.router';

const router = express.Router();

export default (): express.Router => {
  todo(router);
  user(router);

  return router;
};
