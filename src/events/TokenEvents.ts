export const TOKEN_UPSERTED_EVENT = 'token.upserted';

export interface TokenUpsertedPayload {
  accountId: string;
  userId: string;
  deviceId: string;
  fcmToken: string;
  created: boolean;
}
