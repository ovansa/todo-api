import express from 'express';
import todo from './todo.router';

const router = express.Router();

export default (): express.Router => {
  todo(router);

  return router;
};
