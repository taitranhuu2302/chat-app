import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT
        ? parseInt(process.env.REDIS_PORT, 10)
        : 6379,
    });
  }

  async setSocketId(userId: string, socketId: string): Promise<void> {
    await this.redisClient.set(userId, socketId);
  }

  async getSocketId(userId: string): Promise<string | null> {
    return this.redisClient.get(userId);
  }

  async removeSocketId(userId: string): Promise<void> {
    await this.redisClient.del(userId);
  }
}
