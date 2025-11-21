import { randomUUID } from 'node:crypto';
import { PushToken } from '../entities/PushToken';
import { PushTokenRepository, UpsertPayload } from './PushTokenRepository';

export class InMemoryPushTokenRepository implements PushTokenRepository {
  private storage = new Map<string, PushToken>();

  create(data: UpsertPayload): PushToken {
    const token = new PushToken();
    token.id = randomUUID();
    token.userId = data.userId;
    token.deviceId = data.deviceId;
    token.fcmToken = data.fcmToken;
    token.createdAt = new Date();
    token.updatedAt = new Date();
    return token;
  }

  findByUserAndDevice(userId: string, deviceId: string): Promise<PushToken | null> {
    const token =
      Array.from(this.storage.values()).find(
        (candidate) => candidate.userId === userId && candidate.deviceId === deviceId,
      ) ?? null;
    return Promise.resolve(token);
  }

  findByFcmToken(fcmToken: string): Promise<PushToken | null> {
    const token =
      Array.from(this.storage.values()).find((candidate) => candidate.fcmToken === fcmToken) ??
      null;
    return Promise.resolve(token);
  }

  save(token: PushToken): Promise<PushToken> {
    token.updatedAt = new Date();
    this.storage.set(token.id, token);
    return Promise.resolve(token);
  }
}
