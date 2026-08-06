import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { RemoveFruitUseCase } from './remove-fruit.use-case';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';

describe('RemoveFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: RemoveFruitUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new RemoveFruitUseCase(repo);
  });

  it('should remove a fruit successfully if stock amount is less than or equal to amount to remove', async () => {
    const existingFruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });

    repo.findByName.mockResolvedValue(existingFruit);

    const toRemove = {
      name: 'Lemon',
      amount: 5,
    };

    await useCase.execute(toRemove);

    expect(repo.findByName).toHaveBeenCalledWith('Lemon');
    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedFruit = repo.save.mock.calls[0][0];
    expect(savedFruit.getAmount().getValue()).toBe(0);
  });

  it('should throw an error if the fruit to remove exceeds the current stock amount', async () => {
    const existingFruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });

    repo.findByName.mockResolvedValue(existingFruit);

    const toRemove = {
      name: 'Lemon',
      amount: 6,
    };

    await expect(useCase.execute(toRemove)).rejects.toThrow(
      'Cannot remove more than the current amount',
    );

    expect(repo.save).not.toHaveBeenCalled();
  });
});
