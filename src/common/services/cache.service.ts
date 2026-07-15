import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import type { RedisClientType } from 'redis';
import { EmailEnum } from '../enums';

@Injectable()
export class CacheService {
  constructor(
    @Inject('Client Redis')
    private readonly client: RedisClientType,
  ) {}

  // -------------------- Keys --------------------


  revokedTokenPrefix(userId: string | Types.ObjectId) {
    return `user:${userId}:revokedToken`;
  }

  revokedTokenKey(userId: string | Types.ObjectId, jti: string) {
    return `${this.revokedTokenPrefix(userId)}:${jti}`;
  }

  confirmEmailKeyPrefix(userId: string | Types.ObjectId) {
    return `user:${userId}:confirmEmail`;
  }

  forgetPassKeyPrefix(userId: string | Types.ObjectId) {
    return `user:${userId}:forgetPassword`;
  }

  private FCMKey(userId: string | Types.ObjectId) {
    return `user:FCM:${userId.toString()}`;
  }

  // -------------------- Redis --------------------

  async set({
    key,
    value,
    ttl,
  }: {
    key: string;
    value: object | string;
    ttl?: number;
  }) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttl) {
      return this.client.set(key, data, {
        expiration: {
          type: 'EX',
          value: ttl,
        },
      });
    }

    return this.client.set(key, data);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async update({
    key,
    value,
    ttl,
  }: {
    key: string;
    value: object | string;
    ttl?: number;
  }) {
    const exists = await this.client.exists(key);

    if (!exists) return false;

    return this.set({ key, value, ttl });
  }

  async deleteByKey(key: string) {
    return this.client.del(key);
  }

  async expire(key: string, ttl: number) {
    return this.client.expire(key, ttl);
  }

  async getTTL(key: string) {
    return this.client.ttl(key);
  }

  async getKeysByPrefix(prefix: string) {
    return this.client.keys(prefix);
  }



  // -------------------- FCM --------------------

  async addFCM(userId: string | Types.ObjectId, token: string) {
    return this.client.sAdd(this.FCMKey(userId), token);
  }

  async removeFCM(userId: string | Types.ObjectId, token: string) {
    return this.client.sRem(this.FCMKey(userId), token);
  }

  async getFCMs(userId: string | Types.ObjectId) {
    return this.client.sMembers(this.FCMKey(userId));
  }

  async hasFCMs(userId: string | Types.ObjectId) {
    return this.client.sCard(this.FCMKey(userId));
  }

  async removeFCMUser(userId: string | Types.ObjectId) {
    return this.client.del(this.FCMKey(userId));
  }
}