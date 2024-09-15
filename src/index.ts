import 'reflect-metadata';
import { Application } from 'express';
import mongoose from 'mongoose';

import { connectDB, createTestData } from './db';
import { redisClient } from './redis';
import { createServer } from './server';
import logger from './utils/logger';

const app: Application = createServer();

connectDB();
createTestData();

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
