import { EventEmitter } from 'node:events';

export interface DomainEvent<TPayload = unknown> {
  name: string;
  payload: TPayload;
  occurredAt: Date;
}

export type EventHandler<TPayload = unknown> = (event: DomainEvent<TPayload>) => unknown;

export class EventBus {
  private emitter = new EventEmitter();

  emit<TPayload>(name: string, payload: TPayload): void {
    const event: DomainEvent<TPayload> = {
      name,
      payload,
      occurredAt: new Date(),
    };
    this.emitter.emit(name, event);
  }

  on<TPayload>(name: string, handler: EventHandler<TPayload>): void {
    this.emitter.on(name, handler);
  }
}
