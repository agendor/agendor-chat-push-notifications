import { DomainEvent, EventBus } from '../../src/events/EventBus';
import { TOKEN_UPSERTED_EVENT, TokenUpsertedPayload } from '../../src/events/TokenEvents';
import { InMemoryPushTokenRepository } from '../../src/repositories/InMemoryPushTokenRepository';
import { UpsertPushTokenService } from '../../src/services/UpsertPushTokenService';

describe('UpsertPushTokenService', () => {
  const captureEvents = (eventBus: EventBus) => {
    const events: DomainEvent<TokenUpsertedPayload>[] = [];
    eventBus.on<TokenUpsertedPayload>(TOKEN_UPSERTED_EVENT, (event) => events.push(event));
    return events;
  };

  it('cria um token quando não existem registros prévios', async () => {
    const repository = new InMemoryPushTokenRepository();
    const eventBus = new EventBus();
    const events = captureEvents(eventBus);
    const service = new UpsertPushTokenService(repository, eventBus);

    const result = await service.execute({
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-1',
    });

    expect(result.created).toBe(true);
    expect(result.token.userId).toBe('user-1');
    expect(events).toHaveLength(1);
    expect(events[0].payload.created).toBe(true);
  });

  it('atualiza um token existente para o mesmo user + device', async () => {
    const repository = new InMemoryPushTokenRepository();
    const eventBus = new EventBus();
    const service = new UpsertPushTokenService(repository, eventBus);

    await service.execute({ userId: 'user-1', deviceId: 'device-1', fcmToken: 'fcm-1' });
    const result = await service.execute({
      userId: 'user-1',
      deviceId: 'device-1',
      fcmToken: 'fcm-2',
    });

    expect(result.created).toBe(false);
    expect(result.token.fcmToken).toBe('fcm-2');
  });

  it('reassocia um token existente quando o fcm token já está cadastrado', async () => {
    const repository = new InMemoryPushTokenRepository();
    const eventBus = new EventBus();
    const service = new UpsertPushTokenService(repository, eventBus);

    await service.execute({ userId: 'user-1', deviceId: 'device-1', fcmToken: 'fcm-1' });
    const result = await service.execute({
      userId: 'user-2',
      deviceId: 'device-2',
      fcmToken: 'fcm-1',
    });

    expect(result.created).toBe(false);
    expect(result.token.userId).toBe('user-2');
    expect(result.token.deviceId).toBe('device-2');
  });
});
