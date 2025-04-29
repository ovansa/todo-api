import 'reflect-metadata';

import { Application } from 'express';
import { connectDB } from './db';
import { createServer } from './server';
import logger from './utils/logger';
import mongoose from 'mongoose';
import { redisClient } from './redis';

const app: Application = createServer();
let server: ReturnType<Application['listen']>;

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    // await createTestData();

    server = app.listen(port, () => {
      logger.info('🚀 Server running on http://localhost:3000');
    });
  } catch (error) {
    logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  logger.info('Shutting down server...');
  server.close(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
    logger.info('Server shutdown complete.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export { server };
