/* eslint-disable @typescript-eslint/unbound-method */
import { Model } from 'mongoose';
import { OutboxMessageDocument } from './outbox-message.schema';
import { OutboxRepository } from './outbox.repository';

describe('OutboxRepository', () => {
  let model: jest.Mocked<Model<OutboxMessageDocument>>;
  let repository: OutboxRepository;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      updateOne: jest.fn(),
    } as unknown as jest.Mocked<Model<OutboxMessageDocument>>;
    repository = new OutboxRepository(model);
  });

  it('saves an outbox message and marks it unpublished by default', async () => {
    model.create.mockResolvedValue([{}] as any);

    await repository.saveMessage('FruitCreated', { fruitName: 'Lemon' });

    expect(model.create).toHaveBeenCalledWith(
      [
        {
          eventType: 'FruitCreated',
          payload: { fruitName: 'Lemon' },
          published: false,
        },
      ],
      { session: undefined },
    );
  });

  it('finds only unpublished messages', async () => {
    const unpublished = [
      {
        _id: '1',
        eventType: 'FruitCreated',
        payload: { fruitName: 'Lemon' },
        published: false,
      },
    ];

    model.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(unpublished),
    } as any);

    const result = await repository.findUnpublished();

    expect(model.find).toHaveBeenCalledWith({ published: false });
    expect(result).toEqual(unpublished);
  });

  it('marks a message as published by id', async () => {
    model.updateOne.mockResolvedValue({} as any);
    await repository.markPublished('917f1f88bcf86cd799439034');
    expect(model.updateOne).toHaveBeenCalledWith(
      { _id: '917f1f88bcf86cd799439034' },
      { published: true },
    );
  });
});
