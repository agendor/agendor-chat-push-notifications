import request from 'supertest';
import { createApp } from '../../src/app';
import { TokenController } from '../../src/controllers/TokenController';
import { EventBus } from '../../src/events/EventBus';
import { InMemoryPushTokenRepository } from '../../src/repositories/InMemoryPushTokenRepository';
import { UpsertPushTokenService } from '../../src/services/UpsertPushTokenService';

interface TokenResponseBody {
  data: {
    userId: string;
    deviceId: string;
    fcmToken: string;
    createdAt: string;
    updatedAt: string;
  };
  meta: {
    created: boolean;
  };
}

interface ErrorResponseBody {
  errors: Array<{ field: string; message: string }>;
}

const buildTestApp = () => {
  const repository = new InMemoryPushTokenRepository();
  const eventBus = new EventBus();
  const service = new UpsertPushTokenService(repository, eventBus);
  const controller = new TokenController(service);
  return createApp({ tokenController: controller });
};

describe('TokenController', () => {
  it('retorna 201 ao registrar um novo token', async () => {
    const app = buildTestApp();
    const response = await request(app).post('/v1/tokens').send({
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });

    const body = response.body as TokenResponseBody;
    expect(response.status).toBe(201);
    expect(body.data.userId).toBe('user-1');
    expect(body.meta.created).toBe(true);
  });

  it('retorna 400 quando a validação falha', async () => {
    const app = buildTestApp();
    const response = await request(app).post('/v1/tokens').send({
      userId: '',
    });

    const body = response.body as ErrorResponseBody;
    expect(response.status).toBe(400);
    expect(Array.isArray(body.errors)).toBe(true);
  });
});
