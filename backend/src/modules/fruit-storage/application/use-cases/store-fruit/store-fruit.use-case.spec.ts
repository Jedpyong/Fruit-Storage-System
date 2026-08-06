import { StoreFruitUseCase } from './store-fruit.use-case';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';

describe('StoreFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: StoreFruitUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new StoreFruitUseCase(repo);
  });

  it('should store a new fruit successfully', async () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );

    repo.findByName.mockResolvedValue(fruit);
    await useCase.execute({ name: 'Lemon', amount: 5 });

    expect(repo.findByName).toHaveBeenCalledWith('Lemon');
    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedFruit = repo.save.mock.calls[0][0];
    expect(savedFruit.getAmount().getValue()).toBe(5);
  });

  it('should throw an error if the amount to store exceeds the limit', async () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );

    repo.findByName.mockResolvedValue(fruit);
    await expect(
      useCase.execute({ name: 'Lemon', amount: 11 }),
    ).rejects.toThrow('Cannot store more than the storage limit');
  });

  it('should throw an error if the fruit does not exist', async () => {
    repo.findByName.mockResolvedValue(null);
    await expect(useCase.execute({ name: 'Lemon', amount: 5 })).rejects.toThrow(
      'Fruit not found',
    );
  });

  it('should throw an error if the amount to store is negative', async () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    repo.findByName.mockResolvedValue(fruit);
    await expect(
      useCase.execute({ name: 'Lemon', amount: -5 }),
    ).rejects.toThrow('Amount must be a positive integer');
  });
});
