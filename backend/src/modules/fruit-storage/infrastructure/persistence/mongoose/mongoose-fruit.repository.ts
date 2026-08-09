import mongoose, { Model } from 'mongoose';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitDocument } from './fruit.schema';
import { FruitMapper } from './fruit.mapper';
import { OutboxRepository } from './outbox.repository';

export class MongooseFruitRepository implements FruitRepository {
  constructor(
    private readonly model: Model<FruitDocument>,
    private readonly outboxRepo: OutboxRepository,
  ) {}

  async findByName(name: string): Promise<Fruit | null> {
    const doc = await this.model.findOne({ name }).lean();
    return doc ? FruitMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<Fruit[]> {
    const docs = await this.model.find().lean();
    return docs.map((doc) => FruitMapper.toDomain(doc));
  }

  async save(fruit: Fruit): Promise<void> {
    const data: FruitDocument = FruitMapper.toPersistence(fruit);
    const events = fruit.pullDomainEvents();

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await this.model.updateOne(
          {
            name: data.name,
          },
          data,
          { upsert: true, session },
        );
        for (const event of events) {
          await this.outboxRepo.saveMessage(
            (event as any).eventType,
            { ...event },
            session,
          );
        }
      });
    } finally {
      await session.endSession();
    }
  }

  async delete(name: string): Promise<void> {
    await this.model.deleteOne({ name });
  }
}
