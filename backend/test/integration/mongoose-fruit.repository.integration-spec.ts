import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import {
  FruitDocument,
  FruitSchema,
} from '@modules/fruit-storage/infrastructure/persistence/mongoose/fruit.schema';
import { MongooseFruitRepository } from '@modules/fruit-storage/infrastructure/persistence/mongoose/mongoose-fruit.repository';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { OutboxRepository } from '@modules/fruit-storage/infrastructure/persistence/mongoose/outbox.repository';

describe('MongooseFruitRepository Integration', () => {
  let mongod: MongoMemoryReplSet;
  let model: Model<FruitDocument>;
  let repository: MongooseFruitRepository;
  let mockOutboxRepo: jest.Mocked<OutboxRepository>;

  beforeAll(async () => {
    mongod = await MongoMemoryReplSet.create({
      replSet: { count: 1 },
    });
    await mongoose.connect(mongod.getUri());
    model = mongoose.model<FruitDocument>('Fruit', FruitSchema);
  });

  afterEach(async () => {
    await model.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(() => {
    mockOutboxRepo = {
      saveMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<OutboxRepository>;

    repository = new MongooseFruitRepository(
      model,
      mongoose.connection,
      mockOutboxRepo,
    );
  });

  it('saves a fruit and retrieves it by name', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });

    await repository.save(fruit);
    const found = await repository.findByName('Lemon');

    expect(found).not.toBeNull();
    expect(found?.getName().getValue()).toBe('Lemon');
    expect(found?.getDescription().getValue()).toBe('This is a Lemon');
    expect(found?.getLimitOfFruitToBeStored().getValue()).toBe(10);
  });

  it('should return null when fruit is not found', async () => {
    const found = await repository.findByName('nonexistent');
    expect(found).toBeNull();
  });

  it('should update an existing fruit rather than duplicating it (upsert)', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    await repository.save(fruit);

    fruit.store(5);
    await repository.save(fruit);

    const all = await repository.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].getAmount().getValue()).toBe(10);
  });

  it('should delete a fruit', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    await repository.save(fruit);
    await repository.delete('Lemon');
    const found = await repository.findByName('Lemon');
    expect(found).toBeNull();
  });
});
