import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { CreateFruitUseCase } from './create-fruit.use-case';
import { FruitUniquenessChecker } from '@modules/fruit-storage/domain/services/fruit-uniqueness-checker.service';

describe('CreateFruitUseCase', () => {
  let repo: jest.Mocked<FruitRepository>;
  let uniquenessChecker: jest.Mocked<FruitUniquenessChecker>;
  let useCase: CreateFruitUseCase;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    uniquenessChecker = {
      isUnique: jest.fn(),
    } as unknown as jest.Mocked<FruitUniquenessChecker>;

    useCase = new CreateFruitUseCase(repo, uniquenessChecker);
  });
  it('creates and saves a fruit when the name is unique', async () => {
    uniquenessChecker.isUnique.mockResolvedValue(true);

    await useCase.execute({
      name: 'Lemon',
      description: 'This is a Lemon',
      limitOfFruitToBeStored: 10,
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedFruit = repo.save.mock.calls[0][0];
    expect(savedFruit.getName().getValue()).toBe('Lemon');
    expect(savedFruit.getAmount().getValue()).toBe(0);
  });

  it('throws DuplicateFruitNameError when the name is not unique', async () => {
    uniquenessChecker.isUnique.mockResolvedValue(false);

    await expect(
      useCase.execute({
        name: 'Lemon',
        description: 'This is a Lemon',
        limitOfFruitToBeStored: 10,
      }),
    ).rejects.toThrow(`Fruit with name Lemon already exists.`);

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('throws an error when the description exceeds 30 characters', async () => {
    uniquenessChecker.isUnique.mockResolvedValue(true);

    await expect(
      useCase.execute({
        name: 'Lemon',
        description: 'This is a fruit with a very long description.',
        limitOfFruitToBeStored: 10,
      }),
    ).rejects.toThrow('Description must not go beyond 30 characters');

    expect(repo.save).not.toHaveBeenCalled();
  });
});
