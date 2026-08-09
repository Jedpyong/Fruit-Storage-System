import { Fruit } from '../entities/fruit.entity';
import { FruitRepository } from '../repositories/fruit.repository';
import { FruitAmount } from '../value-objects/fruit-amount.vo';
import { FruitDescription } from '../value-objects/fruit-description.vo';
import { FruitName } from '../value-objects/fruit-name.vo';
import { FruitUniquenessChecker } from './fruit-uniqueness-checker.service';

describe('FruitUniquenessChecker', () => {
  let repo: jest.Mocked<FruitRepository>;
  let checker: FruitUniquenessChecker;

  beforeEach(() => {
    repo = {
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    checker = new FruitUniquenessChecker(repo);
  });

  it('returns true when no fruit with that name exists', async () => {
    repo.findByName.mockResolvedValue(null);
    const result = await checker.isUnique('Lemon');

    expect(result).toBe(true);
    expect(repo.findByName).toHaveBeenCalledWith('Lemon');
  });

  it('returns false when a fruit with that name already exists', async () => {
    const existing = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(0),
    });
    repo.findByName.mockResolvedValue(existing);

    const result = await checker.isUnique('Lemon');
    expect(result).toBe(false);
  });

  it('checks case-insensitively', async () => {
    const existing = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(0),
    });
    repo.findByName.mockResolvedValue(existing);
    const result = await checker.isUnique('LEMON');
    expect(result).toBe(false);
  });
});
