import { z } from 'zod';

export const tokenSchema = z.object({
  deviceId: z.string().min(1, 'deviceId required'),
  fcmToken: z.string().min(1, 'fcmToken required'),
});

export type TokenInput = z.infer<typeof tokenSchema>;
