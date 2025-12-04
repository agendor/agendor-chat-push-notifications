import { z } from 'zod';

export const pushTokenSchema = z.object({
  deviceId: z.string().min(1, 'deviceId required'),
  fcmToken: z.string().min(1, 'fcmToken required'),
});

export type PushTokenInput = z.infer<typeof pushTokenSchema>;
