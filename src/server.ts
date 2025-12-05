import { createApp } from './app';
import { env } from './config/env';
import { TokenController } from './controllers/TokenController';
import { PrismaClient } from './generated/prisma/client';
import { PrismaTokenRepository } from './repositories/PrismaTokenRepository';
import { UpsertTokenService } from './services/UpsertTokenService';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.databaseUrl;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const connectDatabase = async (
  prisma: PrismaClient,
  maxRetries = 5,
  retryDelay = 2000,
): Promise<void> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$connect();
      console.info('✅ Database connection established');
      return;
    } catch (error) {
      console.warn(
        `⚠️  Database connection attempt ${attempt}/${maxRetries} failed:`,
        error instanceof Error ? error.message : error,
      );
      if (attempt < maxRetries) {
        console.info(`🔄 Retrying in ${retryDelay}ms...`);
        await sleep(retryDelay);
      } else {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
      }
    }
  }
};

const start = async () => {
  const prisma = new PrismaClient();

  await connectDatabase(prisma);

  const tokenRepository = new PrismaTokenRepository(prisma);

  const upsertTokenService = new UpsertTokenService(tokenRepository);
  const tokenController = new TokenController(upsertTokenService);

  const app = createApp({ tokenController });

  app.listen(env.port, () => {
    console.info(`🚀 API ready on port ${env.port}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.info(`${signal} received, shutting down server...`);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
