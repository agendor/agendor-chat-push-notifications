import { Token } from '../entities/Token';
import { TokenRepository, UpsertPayload } from '../repositories/TokenRepository';

export interface UpsertResult {
  token: Token;
  created: boolean;
}

export class UpsertTokenService {
  constructor(private readonly repository: TokenRepository) {}

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
    return { token: saved, created: true };
  }

  private async updateToken(token: Token, payload: UpsertPayload): Promise<Token> {
    token.accountId = payload.accountId;
    token.userId = payload.userId;
    token.deviceId = payload.deviceId;
    token.fcmToken = payload.fcmToken;
    const saved = await this.repository.save(token);
    return saved;
  }
}
