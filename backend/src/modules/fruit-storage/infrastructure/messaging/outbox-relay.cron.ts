import * as cron from 'node-cron';
import { OutboxRepository } from '../persistence/mongoose/outbox.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class OutboxRelay implements OnModuleDestroy {
  private task?: cron.ScheduledTask;

  constructor(
    private readonly outboxRepo: OutboxRepository,
    private readonly eventBus: EventEmitter2,
  ) {}

  start(): void {
    if (process.env.NODE_ENV === 'test') return;

    this.task = cron.schedule('*/10 * * * * *', () => this.relay());
  }

  onModuleDestroy(): void {
    this.task?.stop();
  }

  async relay(): Promise<void> {
    const pending = await this.outboxRepo.findUnpublished();
    for (const message of pending) {
      this.eventBus.emit(message.eventType, message.payload);
      await this.outboxRepo.markPublished(message._id.toString());
    }
  }
}
