import { Token } from '../entities/Token';
import { PrismaClient } from '../generated/prisma/client';
import { TokenRepository, UpsertPayload } from './TokenRepository';

export class PrismaTokenRepository implements TokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  create(data: UpsertPayload): Token {
    const token = new Token();
    token.accountId = data.accountId;
    token.userId = data.userId;
    token.deviceId = data.deviceId;
    token.fcmToken = data.fcmToken;
    return token;
  }

  async findByAccountUserAndDevice(
    accountId: string,
    userId: string,
    deviceId: string,
  ): Promise<Token | null> {
    const result = await this.prisma.token.findFirst({
      where: {
        accountId,
        userId,
        deviceId,
      },
    });

    if (!result) return null;

    return this.mapToEntity(result);
  }

  async findByFcmToken(fcmToken: string): Promise<Token | null> {
    const result = await this.prisma.token.findUnique({
      where: {
        fcmToken,
      },
    });

    if (!result) return null;

    return this.mapToEntity(result);
  }

  async save(token: Token): Promise<Token> {
    if (token.id) {
      // Update existing token
      const result = await this.prisma.token.update({
        where: { id: token.id },
        data: {
          accountId: token.accountId,
          userId: token.userId,
          deviceId: token.deviceId,
          fcmToken: token.fcmToken,
        },
      });
      return this.mapToEntity(result);
    } else {
      // Create new token
      const result = await this.prisma.token.create({
        data: {
          accountId: token.accountId,
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
    accountId: string;
    userId: string;
    deviceId: string;
    fcmToken: string;
    createdAt: Date;
    updatedAt: Date;
  }): Token {
    const token = new Token();
    token.id = prismaToken.id;
    token.accountId = prismaToken.accountId;
    token.userId = prismaToken.userId;
    token.deviceId = prismaToken.deviceId;
    token.fcmToken = prismaToken.fcmToken;
    token.createdAt = prismaToken.createdAt;
    token.updatedAt = prismaToken.updatedAt;
    return token;
  }
}
