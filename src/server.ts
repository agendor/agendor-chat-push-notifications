import { createApp } from './app';
import { env } from './config/env';
import { TokenController } from './controllers/TokenController';
import { EventBus } from './events/EventBus';
import { PrismaClient } from './generated/prisma/client';
import { TokenEventLogger } from './listeners/TokenEventLogger';
import { PrismaPushTokenRepository } from './repositories/PrismaPushTokenRepository';
import { UpsertPushTokenService } from './services/UpsertPushTokenService';

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
      console.info('✅ Conexão com banco de dados estabelecida');
      return;
    } catch (error) {
      console.warn(
        `⚠️  Tentativa ${attempt}/${maxRetries} de conexão com banco falhou:`,
        error instanceof Error ? error.message : error,
      );
      if (attempt < maxRetries) {
        console.info(`🔄 Tentando novamente em ${retryDelay}ms...`);
        await sleep(retryDelay);
      } else {
        throw new Error(`Falha ao conectar com banco de dados após ${maxRetries} tentativas`);
      }
    }
  }
};

const start = async () => {
  const prisma = new PrismaClient();

  await connectDatabase(prisma);

  const pushTokenRepository = new PrismaPushTokenRepository(prisma);

  const eventBus = new EventBus();
  const tokenEventLogger = new TokenEventLogger(eventBus);
  tokenEventLogger.register();

  const upsertPushTokenService = new UpsertPushTokenService(pushTokenRepository, eventBus);
  const tokenController = new TokenController(upsertPushTokenService);

  const app = createApp({ tokenController });

  app.listen(env.port, () => {
    console.info(`🚀 API pronta na porta ${env.port}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.info(`${signal} recebido, encerrando servidor...`);
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
  console.error('Falha ao subir o servidor', error);
  process.exit(1);
});
