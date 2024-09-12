import 'reflect-metadata';
import { Application } from 'express';

import logger from './utils/logger';
import { connectDB } from './db';
import { createServer } from './server';
import mongoose from 'mongoose';
import { redisClient } from './redis';

const app: Application = createServer();

connectDB();
const server = app.listen(3000, () => {
  logger.info('Server running on http://localhost:3000.');
});

const shutdown = async () => {
  logger.info('Shutting down server...');
  server.close(async () => {
    logger.info('Server closed');
    await mongoose.connection.close();
    await redisClient.quit();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export { server };
