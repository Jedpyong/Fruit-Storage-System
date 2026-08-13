import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutboxRelay } from './infrastructure/messaging/outbox-relay.cron';
import {
  FruitDocument,
  FruitSchema,
} from './infrastructure/persistence/mongoose/fruit.schema';
import {
  OutboxMessageDocument,
  OutboxMessageSchema,
} from './infrastructure/persistence/mongoose/outbox-message.schema';
import { OutboxRepository } from './infrastructure/persistence/mongoose/outbox.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FruitController } from './infrastructure/rest/fruit.controller';
import { MongooseFruitRepository } from './infrastructure/persistence/mongoose/mongoose-fruit.repository';
import { CreateFruitUseCase } from './application/use-cases/create-fruit/create-fruit.use-case';
import { DeleteFruitUseCase } from './application/use-cases/delete-fruit/delete-fruit.use-case';
import { FindFruitUseCase } from './application/use-cases/find-fruit/find-fruit.use-case';
import { ListFruitsUseCase } from './application/use-cases/list-fruits/list-fruits.use-case';
import { RemoveFruitUseCase } from './application/use-cases/remove-fruit/remove-fruit.use-case';
import { StoreFruitUseCase } from './application/use-cases/store-fruit/store-fruit.use-case';
import { UpdateFruitUseCase } from './application/use-cases/update-fruit/update-fruit.use-case';
import { FruitUniquenessChecker } from './domain/services/fruit-uniqueness-checker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FruitDocument.name, schema: FruitSchema },
      { name: OutboxMessageDocument.name, schema: OutboxMessageSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    { provide: 'FruitRepository', useClass: MongooseFruitRepository },
    OutboxRepository,
    OutboxRelay,
    FruitUniquenessChecker,
    CreateFruitUseCase,
    UpdateFruitUseCase,
    DeleteFruitUseCase,
    StoreFruitUseCase,
    RemoveFruitUseCase,
    FindFruitUseCase,
    ListFruitsUseCase,
  ],
  controllers: [FruitController],
})
export class FruitStorageModule implements OnModuleInit {
  constructor(private readonly outboxRelay: OutboxRelay) {}

  onModuleInit() {
    this.outboxRelay.start();
  }
}
