import { Token } from '../entities/Token';

export interface UpsertPayload {
  accountId: string;
  userId: string;
  deviceId: string;
  fcmToken: string;
}

export interface TokenRepository {
  findByAccountUserAndDevice(
    accountId: string,
    userId: string,
    deviceId: string,
  ): Promise<Token | null>;
  findByFcmToken(fcmToken: string): Promise<Token | null>;
  save(token: Token): Promise<Token>;
  create(data: UpsertPayload): Token;
}
