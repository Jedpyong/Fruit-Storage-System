import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { ListFruitsUseCase } from './list-fruits.use-case';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';

describe('ListFruitsUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: ListFruitsUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new ListFruitsUseCase(repo);
  });

  it('should return all fruits', async () => {
    const fruits = [
      Fruit.reconstitute({
        name: FruitName.create('Lemon'),
        description: FruitDescription.create('This is a Lemon'),
        limitOfFruitToBeStored: FruitAmount.create(10),
        amount: FruitAmount.create(5),
      }),
      Fruit.reconstitute({
        name: FruitName.create('Apple'),
        description: FruitDescription.create('This is an Apple'),
        limitOfFruitToBeStored: FruitAmount.create(15),
        amount: FruitAmount.create(7),
      }),
    ];
    repo.findAll.mockResolvedValue(fruits);

    const result = await useCase.execute();

    expect(result).toEqual(fruits);
    expect(repo.findAll).toHaveBeenCalled();
  });

  it('should return an empty array when there are no fruits', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(repo.findAll).toHaveBeenCalled();
  });

  it('should handle errors thrown by the repository', async () => {
    repo.findAll.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute()).rejects.toThrow('Database error');
    expect(repo.findAll).toHaveBeenCalled();
  });
});
