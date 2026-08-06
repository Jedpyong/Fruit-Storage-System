import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { UpdateFruitUseCase } from './update-fruit.use-case';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';

describe('UpdateFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: UpdateFruitUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateFruitUseCase(repo);
  });

  it('should update a fruit successfully', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    repo.findByName.mockResolvedValue(fruit);
    await useCase.execute({
      name: 'Lemon',
      description: 'Updated lemon description',
      limitOfFruitToBeStored: 10,
    });

    expect(repo.findByName).toHaveBeenCalledWith('Lemon');
    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedFruit = repo.save.mock.calls[0][0];
    expect(savedFruit.getDescription().getValue()).toBe(
      'Updated lemon description',
    );
  });

  it('should throw an error if the new description exceeds 30 letter', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    repo.findByName.mockResolvedValue(fruit);
    await expect(
      useCase.execute({
        name: 'Lemon',
        description: 'updated lemon with a long description',
        limitOfFruitToBeStored: 10,
      }),
    ).rejects.toThrow('Description must not go beyond 30 characters');
  });

  it('should throw an error if the new limit is less than the current amount', async () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(8),
    });
    repo.findByName.mockResolvedValue(fruit);
    await expect(
      useCase.execute({
        name: 'Lemon',
        description: 'Updated lemon description',
        limitOfFruitToBeStored: 5,
      }),
    ).rejects.toThrow('New limit cannot be less than the current amount');
  });

  it('should throw an error if the fruit does not exist', async () => {
    repo.findByName.mockResolvedValue(null);
    await expect(
      useCase.execute({
        name: 'NonExistentFruit',
        description: 'Some description',
        limitOfFruitToBeStored: 10,
      }),
    ).rejects.toThrow('Fruit not found');
  });
});
