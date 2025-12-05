import request from 'supertest';
import { beforeEach, vi } from 'vitest';
import { createApp } from '../../src/app';
import { env } from '../../src/config/env';
import { TokenController } from '../../src/controllers/TokenController';
import { InMemoryTokenRepository } from '../../src/repositories/InMemoryTokenRepository';
import { UpsertTokenService } from '../../src/services/UpsertTokenService';
import { generateTestToken } from '../helpers/jwtHelper';

interface TokenResponseBody {
  data: {
    accountId: string;
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
  const repository = new InMemoryTokenRepository();
  const service = new UpsertTokenService(repository);
  const controller = new TokenController(service);
  return createApp({ tokenController: controller });
};

describe('TokenController', () => {
  beforeEach(() => {
    vi.spyOn(env, 'jwtSecretKey', 'get').mockReturnValue('test-secret-key');
  });

  it('returns 201 when registering a new token', async () => {
    const app = buildTestApp();
    const token = generateTestToken('account-1', 'user-1');

    const response = await request(app)
      .post('/v1/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deviceId: 'device-1',
        fcmToken: 'fcm-1',
      });

    const body = response.body as TokenResponseBody;
    expect(response.status).toBe(201);
    expect(body.data.accountId).toBe('account-1');
    expect(body.data.userId).toBe('user-1');
    expect(body.meta.created).toBe(true);
  });

  it('returns 401 when token is not provided', async () => {
    const app = buildTestApp();
    const response = await request(app).post('/v1/tokens').send({
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });

    expect(response.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    const app = buildTestApp();
    const response = await request(app)
      .post('/v1/tokens')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        deviceId: 'device-1',
        fcmToken: 'fcm-1',
      });

    expect(response.status).toBe(401);
  });

  it('returns 400 when validation fails', async () => {
    const app = buildTestApp();
    const token = generateTestToken('account-1', 'user-1');

    const response = await request(app)
      .post('/v1/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deviceId: '',
      });

    const body = response.body as ErrorResponseBody;
    expect(response.status).toBe(400);
    expect(Array.isArray(body.errors)).toBe(true);
  });
});
