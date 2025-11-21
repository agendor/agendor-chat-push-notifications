import { PushToken } from '../entities/PushToken';

export interface UpsertPayload {
  userId: string;
  deviceId: string;
  fcmToken: string;
}

export interface PushTokenRepository {
  findByUserAndDevice(userId: string, deviceId: string): Promise<PushToken | null>;
  findByFcmToken(fcmToken: string): Promise<PushToken | null>;
  save(token: PushToken): Promise<PushToken>;
  create(data: UpsertPayload): PushToken;
}
