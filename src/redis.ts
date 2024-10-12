import { Redis } from 'ioredis';

import { config } from './config';
import logger from './utils/logger';

class RedisClient {
  private client: Redis | null = null;
  private redisHost: string = '';
  private redisPort: number = 0;

  constructor() {
    if (config.isRedisEnabled == true) {
      this.redisHost =
        config.env === 'test' || config.env === 'development' ? '127.0.0.1' : config.redis.host;

      this.redisPort =
        config.env === 'test' || config.env === 'development' ? 6379 : config.redis.port;
      this.client = new Redis({
        host: this.redisHost,
        port: this.redisPort,
        password:
          config.env === 'test' || config.env === 'development' ? '' : config.redis.password,
      });

      this.client.on('connect', () => {
        logger.info(`Redis connected: ${this.redisHost}`);
      });

      this.client.on('error', (err: Error) => {
        console.log(err);
        logger.error('Redis error: ', err);
      });
    } else {
      logger.info('Redis is disabled.');
    }
  }

  async set(key: string, value: string, expiration: number = 3600): Promise<void> {
    if (!this.client) {
      logger.warn('Redis is disabled. Skipping set operation.');
      return;
    }
    try {
      await this.client.set(key, value, 'EX', expiration);
    } catch (err) {
      logger.error('Error setting value in Redis:', err);
      throw err;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      logger.warn('Redis is disabled. Skipping get operation.');
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (err) {
      logger.error('Error getting value from Redis:', err);
      throw err;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) {
      logger.warn('Redis is disabled. Skipping delete operation.');
      return;
    }
    try {
      await this.client.del(key);
    } catch (err) {
      logger.error('Error deleting value from Redis:', err);
      throw err;
    }
  }

  async quit(): Promise<void> {
    if (!this.client) {
      logger.warn('Redis is disabled. Skipping quit operation.');
      return;
    }
    try {
      await this.client.quit();
      logger.info('Redis connection closed.');
    } catch (err) {
      logger.error('Error closing Redis connection:', err);
      throw err;
    }
  }
}

export const redisClient = new RedisClient();
