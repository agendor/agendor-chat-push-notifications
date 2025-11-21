import { PushToken } from '../entities/PushToken';
import { PrismaClient } from '../generated/prisma/client';
import { PushTokenRepository, UpsertPayload } from './PushTokenRepository';

export class PrismaPushTokenRepository implements PushTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(data: UpsertPayload): PushToken {
    const token = new PushToken();
    token.userId = data.userId;
    token.deviceId = data.deviceId;
    token.fcmToken = data.fcmToken;
    return token;
  }

  async findByUserAndDevice(userId: string, deviceId: string): Promise<PushToken | null> {
    const result = await this.prisma.pushToken.findFirst({
      where: {
        userId,
        deviceId,
      },
    });

    if (!result) return null;

    return this.mapToEntity(result);
  }

  async findByFcmToken(fcmToken: string): Promise<PushToken | null> {
    const result = await this.prisma.pushToken.findUnique({
      where: {
        fcmToken,
      },
    });

    if (!result) return null;

    return this.mapToEntity(result);
  }

  async save(token: PushToken): Promise<PushToken> {
    if (token.id) {
      // Update existing token
      const result = await this.prisma.pushToken.update({
        where: { id: token.id },
        data: {
          userId: token.userId,
          deviceId: token.deviceId,
          fcmToken: token.fcmToken,
        },
      });
      return this.mapToEntity(result);
    } else {
      // Create new token
      const result = await this.prisma.pushToken.create({
        data: {
          userId: token.userId,
          deviceId: token.deviceId,
          fcmToken: token.fcmToken,
        },
      });
      return this.mapToEntity(result);
    }
  }

  private mapToEntity(prismaToken: {
    id: string;
    userId: string;
    deviceId: string;
    fcmToken: string;
    createdAt: Date;
    updatedAt: Date;
  }): PushToken {
    const token = new PushToken();
    token.id = prismaToken.id;
    token.userId = prismaToken.userId;
    token.deviceId = prismaToken.deviceId;
    token.fcmToken = prismaToken.fcmToken;
    token.createdAt = prismaToken.createdAt;
    token.updatedAt = prismaToken.updatedAt;
    return token;
  }
}
