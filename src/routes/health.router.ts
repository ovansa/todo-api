import express from 'express';

import { healthCheck } from '../controllers/health.controller';

export default (router: express.Router): void => {
  router.route('/').get(healthCheck);
};
