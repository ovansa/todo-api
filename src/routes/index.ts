import express from 'express';

import healthCheck from './health.router';
import todo from './todo.router';
import user from './user.router';

const router = express.Router();

export default (): express.Router => {
  healthCheck(router);
  todo(router);
  user(router);

  return router;
};
