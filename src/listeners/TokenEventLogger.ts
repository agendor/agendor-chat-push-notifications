import { DomainEvent, EventBus } from '../events/EventBus';
import { TOKEN_UPSERTED_EVENT, TokenUpsertedPayload } from '../events/TokenEvents';

export class TokenEventLogger {
  constructor(private readonly eventBus: EventBus) {}

  register(): void {
    this.eventBus.on<TokenUpsertedPayload>(TOKEN_UPSERTED_EVENT, this.handleTokenUpserted);
  }

  private handleTokenUpserted = (event: DomainEvent<TokenUpsertedPayload>): void => {
    const action = event.payload.created ? 'registrado' : 'atualizado';
    console.info(
      `[TokenEventLogger] Token ${action} para user=${event.payload.userId} device=${event.payload.deviceId}`,
    );
  };
}
