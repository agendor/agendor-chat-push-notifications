import { InMemoryTokenRepository } from '../../src/repositories/InMemoryTokenRepository';
import { UpsertTokenService } from '../../src/services/UpsertTokenService';

describe('UpsertTokenService', () => {
  it('creates a token when no previous records exist', async () => {
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

  it('updates an existing token for the same account + user + device', async () => {
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

  it('reassigns an existing token when the fcm token is already registered', async () => {
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
