import { Redis } from 'ioredis';
import logger from './utils/logger';
import { config } from './config';

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

redisClient.on('connect', () => {
  logger.info('Redis connected.');
});

redisClient.on('error', (err: Error) => {
  logger.error('Redis error: ', err);
});

export const closeRedis = () => {
  redisClient.quit().then(() => logger.info('Redis connection closed.'));
};
