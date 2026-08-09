import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FindFruitUseCase } from './find-fruit.use-case';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';

describe('FindFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: FindFruitUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new FindFruitUseCase(repo);
  });

  it('should return the fruit when it exists', async () => {
    const existingFruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    repo.findByName.mockResolvedValue(existingFruit);

    const result = await useCase.execute('Lemon');

    expect(result).toEqual(existingFruit);
    expect(repo.findByName).toHaveBeenCalledWith('Lemon');
  });

  it('should be case insensitive when finding the fruit', async () => {
    const existingFruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    repo.findByName.mockResolvedValue(existingFruit);

    const result = await useCase.execute('LEMON');

    expect(result).toEqual(existingFruit);
    expect(repo.findByName).toHaveBeenCalledWith('LEMON');
  });

  it('should throw an error when the fruit does not exist', async () => {
    repo.findByName.mockResolvedValue(null);

    await expect(useCase.execute('NonExistentFruit')).rejects.toThrow(
      'Fruit not found',
    );
    expect(repo.findByName).toHaveBeenCalledWith('NonExistentFruit');
  });
});
