import { PushToken } from '../entities/PushToken';
import { EventBus } from '../events/EventBus';
import { TOKEN_UPSERTED_EVENT } from '../events/TokenEvents';
import { PushTokenRepository, UpsertPayload } from '../repositories/PushTokenRepository';

export interface UpsertResult {
  token: PushToken;
  created: boolean;
}

export class UpsertPushTokenService {
  constructor(
    private readonly repository: PushTokenRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(payload: UpsertPayload): Promise<UpsertResult> {
    const existingByComposite = await this.repository.findByAccountUserAndDevice(
      payload.accountId,
      payload.userId,
      payload.deviceId,
    );

    if (existingByComposite) {
      const updated = await this.updateToken(existingByComposite, payload);
      return { token: updated, created: false };
    }

    const existingByFcm = await this.repository.findByFcmToken(payload.fcmToken);

    if (existingByFcm) {
      const reassigned = await this.updateToken(existingByFcm, payload);
      return { token: reassigned, created: false };
    }

    const created = this.repository.create(payload);
    const saved = await this.repository.save(created);
    this.emitEvent(saved, true);
    return { token: saved, created: true };
  }

  private async updateToken(token: PushToken, payload: UpsertPayload): Promise<PushToken> {
    token.accountId = payload.accountId;
    token.userId = payload.userId;
    token.deviceId = payload.deviceId;
    token.fcmToken = payload.fcmToken;
    const saved = await this.repository.save(token);
    this.emitEvent(saved, false);
    return saved;
  }

  private emitEvent(token: PushToken, created: boolean): void {
    this.eventBus.emit(TOKEN_UPSERTED_EVENT, {
      accountId: token.accountId,
      userId: token.userId,
      deviceId: token.deviceId,
      fcmToken: token.fcmToken,
      created,
    });
  }
}
