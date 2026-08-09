import { OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Module from 'module';
import { OutboxRelay } from './infrastructure/messaging/outbox-relay.cron';
import {
  FruitDocument,
  FruitSchema,
} from './infrastructure/persistence/mongoose/fruit.schema';
import {
  OutboxMessageDocument,
  OutboxMessageSchema,
} from './infrastructure/persistence/mongoose/outbox-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FruitDocument.name, schema: FruitSchema },
      { name: OutboxMessageDocument.name, schema: OutboxMessageSchema },
    ]),
  ],
  providers: [OutboxRelay],
})
export class FruitStorageModule implements OnModuleInit {
  constructor(private readonly outboxRelay: OutboxRelay) {}

  onModuleInit() {
    this.outboxRelay.start();
  }
}
