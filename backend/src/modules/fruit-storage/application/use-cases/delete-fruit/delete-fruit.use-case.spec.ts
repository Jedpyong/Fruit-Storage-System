import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { DeleteFruitUseCase } from './delete-fruit.use-case';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';

describe('DeleteFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let useCase: DeleteFruitUseCase;

  const buildFruit = (amount: number) =>
    Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(amount),
    });

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteFruitUseCase(repo);
  });
  it('deletes a fruit when it exists and with zero stock', async () => {
    repo.findByName.mockResolvedValue(buildFruit(0));
    await useCase.execute({ name: 'Lemon', forceDelete: false });
    expect(repo.delete).toHaveBeenCalledWith('Lemon');
  });
  it('throws error when stock remains and forceDelete is false', async () => {
    repo.findByName.mockResolvedValue(buildFruit(5));
    await expect(
      useCase.execute({ name: 'Lemon', forceDelete: false }),
    ).rejects.toThrow('Cannot delete fruit with remaining stock');
    expect(repo.delete).not.toHaveBeenCalled();
  });
  it('deletes a fruit with stock remaining when forceDelete is true', async () => {
    repo.findByName.mockResolvedValue(buildFruit(5));
    await useCase.execute({ name: 'Lemon', forceDelete: true });
    expect(repo.delete).toHaveBeenCalledWith('Lemon');
  });
});
