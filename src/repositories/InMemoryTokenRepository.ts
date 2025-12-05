import { randomUUID } from 'node:crypto';
import { Token } from '../entities/Token';
import { TokenRepository, UpsertPayload } from './TokenRepository';

export class InMemoryTokenRepository implements TokenRepository {
  private storage = new Map<string, Token>();

  create(data: UpsertPayload): Token {
    const token = new Token();
    token.id = randomUUID();
    token.accountId = data.accountId;
    token.userId = data.userId;
    token.deviceId = data.deviceId;
    token.fcmToken = data.fcmToken;
    token.createdAt = new Date();
    token.updatedAt = new Date();
    return token;
  }

  findByAccountUserAndDevice(
    accountId: string,
    userId: string,
    deviceId: string,
  ): Promise<Token | null> {
    const token =
      Array.from(this.storage.values()).find(
        (candidate) =>
          candidate.accountId === accountId &&
          candidate.userId === userId &&
          candidate.deviceId === deviceId,
      ) ?? null;
    return Promise.resolve(token);
  }

  findByFcmToken(fcmToken: string): Promise<Token | null> {
    const token =
      Array.from(this.storage.values()).find((candidate) => candidate.fcmToken === fcmToken) ??
      null;
    return Promise.resolve(token);
  }

  save(token: Token): Promise<Token> {
    token.updatedAt = new Date();
    this.storage.set(token.id, token);
    return Promise.resolve(token);
  }
}
