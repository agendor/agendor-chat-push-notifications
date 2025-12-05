import { InMemoryTokenRepository } from '../../src/repositories/InMemoryTokenRepository';
import { UpsertTokenService } from '../../src/services/UpsertTokenService';

describe('UpsertTokenService', () => {
  it('cria um token quando não existem registros prévios', async () => {
    const repository = new InMemoryTokenRepository();
    const service = new UpsertTokenService(repository);

    const result = await service.execute({
      accountId: 'account-1',
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });

    expect(result.created).toBe(true);
    expect(result.token.accountId).toBe('account-1');
    expect(result.token.userId).toBe('user-1');
  });

  it('atualiza um token existente para o mesmo account + user + device', async () => {
    const repository = new InMemoryTokenRepository();
    const service = new UpsertTokenService(repository);

    await service.execute({
      accountId: 'account-1',
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });
    const result = await service.execute({
      accountId: 'account-1',
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-2',
    });

    expect(result.created).toBe(false);
    expect(result.token.fcmToken).toBe('fcm-2');
  });

  it('reassocia um token existente quando o fcm token já está cadastrado', async () => {
    const repository = new InMemoryTokenRepository();
    const service = new UpsertTokenService(repository);

    await service.execute({
      accountId: 'account-1',
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });
    const result = await service.execute({
      accountId: 'account-2',
      userId: 'user-2',
      deviceId: 'device-2',
      fcmToken: 'fcm-1',
    });

    expect(result.created).toBe(false);
    expect(result.token.accountId).toBe('account-2');
    expect(result.token.userId).toBe('user-2');
    expect(result.token.deviceId).toBe('device-2');
  });
});
