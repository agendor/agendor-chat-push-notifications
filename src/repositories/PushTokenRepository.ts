import { PushToken } from '../entities/PushToken';

export interface UpsertPayload {
  accountId: string;
  userId: string;
  deviceId: string;
  fcmToken: string;
}

export interface PushTokenRepository {
  findByAccountUserAndDevice(
    accountId: string,
    userId: string,
    deviceId: string,
  ): Promise<PushToken | null>;
  findByFcmToken(fcmToken: string): Promise<PushToken | null>;
  save(token: PushToken): Promise<PushToken>;
  create(data: UpsertPayload): PushToken;
}
