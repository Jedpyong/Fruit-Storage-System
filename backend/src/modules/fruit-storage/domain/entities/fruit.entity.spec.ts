import { FruitAmount } from '../value-objects/fruit-amount.vo';
import { FruitDescription } from '../value-objects/fruit-description.vo';
import { FruitName } from '../value-objects/fruit-name.vo';
import { Fruit } from './fruit.entity';

describe('Fruit', () => {
  it('create a valid fruit entity', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    expect(fruit.getName().getValue()).toBe('Lemon');
    expect(fruit.getDescription().getValue()).toBe('This is a Lemon');
    expect(fruit.getLimitOfFruitToBeStored().getValue()).toBe(10);
    expect(fruit.getAmount().getValue()).toBe(0);
  });

  it('throws an error when creating a fruit entity with less than 0 storage limit', () => {
    expect(() =>
      Fruit.createNew(
        FruitName.create('Lemon'),
        FruitDescription.create('This is a Lemon'),
        FruitAmount.create(-5),
      ),
    ).toThrow('Amount must be a positive integer number');
  });

  it('throws an error when creating a fruit entity with invalid name', () => {
    expect(() =>
      Fruit.createNew(
        FruitName.create(''),
        FruitDescription.create('This is a Lemon'),
        FruitAmount.create(10),
      ),
    ).toThrow('Name must not be empty');
  });

  it('throws an error when creating a fruit entity with invalid description', () => {
    expect(() =>
      Fruit.createNew(
        FruitName.create('Lemon'),
        FruitDescription.create('This is a fruit with a very long description'),
        FruitAmount.create(10),
      ),
    ).toThrow('Description must not go beyond 30 characters');
  });

  it('throws an error when creating a fruit entity with invalid storage limit', () => {
    expect(() =>
      Fruit.createNew(
        FruitName.create('Lemon'),
        FruitDescription.create('This is a Lemon'),
        FruitAmount.create(-5),
      ),
    ).toThrow('Amount must be a positive integer number');
  });

  it('can store fruit within the storage limit', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    expect(fruit.getAmount().getValue()).toBe(5);
  });

  it('throws an error when storing more than the storage limit', () => {
    expect(() =>
      Fruit.createNew(
        FruitName.create('Lemon'),
        FruitDescription.create('This is a Lemon'),
        FruitAmount.create(10),
      ).store(15),
    ).toThrow('Cannot store more than the storage limit');
  });

  it('throws an error when storing a negative amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    expect(() => fruit.store(-5)).toThrow(
      'Amount must be a positive integer number',
    );
  });

  it('can remove fruit within the current amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    fruit.remove(3);
    expect(fruit.getAmount().getValue()).toBe(2);
  });

  it('throws an error when removing more than the current amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    expect(() => fruit.remove(10)).toThrow(
      'Cannot remove more than the current amount',
    );
  });

  it('throws an error when removing a negative amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    expect(() => fruit.remove(-5)).toThrow('Amount to remove must be positive');
  });

  it('throws an error when deleting a fruit entity with existing non-zero amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    expect(fruit.canBeDeleted()).toBe(false);
  });

  it('allows a deletion for a fruit entity with existing non-zero amount when forceDelete is true', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    expect(fruit.canBeDeleted(true)).toBe(true);
  });

  it('allows update of fruit entity properties', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.update(
      FruitName.create('Lemon'),
      FruitDescription.create('Updated lemon description'),
      FruitAmount.create(15),
      fruit.getAmount(),
    );
    expect(fruit.getName().getValue()).toBe('Lemon');
    expect(fruit.getDescription().getValue()).toBe('Updated lemon description');
    expect(fruit.getLimitOfFruitToBeStored().getValue()).toBe(15);
  });

  it('throws an error when updating a fruit entity with invalid name', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    expect(() =>
      fruit.update(
        FruitName.create(''),
        FruitDescription.create('This is an Orange'),
        FruitAmount.create(15),
        fruit.getAmount(),
      ),
    ).toThrow('Name must not be empty');
  });

  it('throws an error when updating a fruit entity with invalid description', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    expect(() =>
      fruit.update(
        FruitName.create('Lemon'),
        FruitDescription.create('Updated lemon with a long description'),
        FruitAmount.create(10),
        fruit.getAmount(),
      ),
    ).toThrow('Description must not go beyond 30 characters');
  });

  it('throws an error when updating a fruit entity with storage limit less than the current amount', () => {
    const fruit = Fruit.createNew(
      FruitName.create('Lemon'),
      FruitDescription.create('This is a Lemon'),
      FruitAmount.create(10),
    );
    fruit.store(5);
    expect(() =>
      fruit.update(
        FruitName.create('Orange'),
        FruitDescription.create('This is an Orange'),
        FruitAmount.create(3),
        fruit.getAmount(),
      ),
    ).toThrow('New limit cannot be less than the current amount');
  });

  it('rebuilds a fruit entity from its existing properties', () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      amount: FruitAmount.create(5),
      limitOfFruitToBeStored: FruitAmount.create(10),
    });
    expect(fruit.getName().getValue()).toBe('Lemon');
    expect(fruit.getDescription().getValue()).toBe('This is a Lemon');
    expect(fruit.getAmount().getValue()).toBe(5);
    expect(fruit.getLimitOfFruitToBeStored().getValue()).toBe(10);
  });
});
