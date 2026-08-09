import { FruitFactory } from './fruit.factory';

describe('FruitFactory', () => {
  it('creates a fruit entity with valid parameters', () => {
    const fruit = FruitFactory.create({
      name: 'Lemon',
      description: 'This is a Lemon',
      limitOfFruitToBeStored: 10,
    });
    expect(fruit.getName().getValue()).toBe('Lemon');
    expect(fruit.getDescription().getValue()).toBe('This is a Lemon');
    expect(fruit.getLimitOfFruitToBeStored().getValue()).toBe(10);
    expect(fruit.getAmount().getValue()).toBe(0);
  });

  it('throws an error when creating a fruit entity with invalid name', () => {
    expect(() =>
      FruitFactory.create({
        name: '',
        description: 'This is a Lemon',
        limitOfFruitToBeStored: 10,
      }),
    ).toThrow('Name must not be empty');
  });

  it('throws an error when creating a fruit entity with invalid description', () => {
    expect(() =>
      FruitFactory.create({
        name: 'Lemon',
        description: 'This is a fruit with a very long description',
        limitOfFruitToBeStored: 10,
      }),
    ).toThrow('Description must not go beyond 30 characters');
  });

  it('throws an error when creating a fruit entity with invalid storage limit', () => {
    expect(() =>
      FruitFactory.create({
        name: 'Lemon',
        description: 'This is a Lemon',
        limitOfFruitToBeStored: -5,
      }),
    ).toThrow('Amount must be a positive integer number');
  });
});
