/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { OutboxRelay } from './outbox-relay.cron';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('OutboxRelay.relay', () => {
  it('publishes each unpublished message and marks it published', async () => {
    const outboxRepo = {
      findUnpublished: jest.fn().mockResolvedValue([
        {
          _id: '1',
          eventType: 'FruitCreated',
          payload: { fruitName: 'Lemon' },
        },
      ]),
      markPublished: jest.fn(),
    } as any;
    const eventBus = { emit: jest.fn() } as any;
    const relay = new OutboxRelay(outboxRepo, eventBus);
    await relay.relay();

    expect(eventBus.emit).toHaveBeenCalledWith('FruitCreated', {
      fruitName: 'Lemon',
    });
    expect(outboxRepo.markPublished).toHaveBeenCalledWith('1');
  });
});
