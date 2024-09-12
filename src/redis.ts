import { Redis } from 'ioredis';
import logger from './utils/logger';
import { config } from './config';

export const redisClient = new Redis({
  host:
    config.env === 'test' || config.env === 'development'
      ? '127.00.1'
      : config.redis.host,
  port:
    config.env === 'test' || config.env === 'development'
      ? 6379
      : config.redis.port,
  password:
    config.env === 'test' || config.env === 'development'
      ? ''
      : config.redis.password,
});

redisClient.on('connect', () => {
  logger.info('Redis connected.');
});

redisClient.on('error', (err: Error) => {
  console.log(err);
  logger.error('Redis error: ', err);
});

export const closeRedis = () => {
  redisClient.quit().then(() => logger.info('Redis connection closed.'));
};
