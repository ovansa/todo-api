import { healthCheck } from '../controllers/health.controller';
import express from 'express';

export default (router: express.Router): void => {
  router.route('/').get(healthCheck);
};
