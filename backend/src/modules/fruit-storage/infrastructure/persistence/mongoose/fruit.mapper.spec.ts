import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitMapper } from './fruit.mapper';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';

describe('FruitMapper', () => {
  it('maps a raw Mongoose document to a domain Fruit entity', () => {
    const raw = {
      name: 'Lemon',
      description: 'This is a Lemon',
      limitOfFruitToBeStored: 10,
      amount: 5,
    };

    const fruit = FruitMapper.toDomain(raw);

    expect(fruit).toBeInstanceOf(Fruit);
    expect(fruit.getName().getValue()).toBe('Lemon');
    expect(fruit.getDescription().getValue()).toBe('This is a Lemon');
    expect(fruit.getLimitOfFruitToBeStored().getValue()).toBe(10);
    expect(fruit.getAmount().getValue()).toBe(5);
  });

  it('maps a domain Fruit entity to a raw Mongoose document', () => {
    const fruit = Fruit.reconstitute({
      name: FruitName.create('Lemon'),
      description: FruitDescription.create('This is a Lemon'),
      limitOfFruitToBeStored: FruitAmount.create(10),
      amount: FruitAmount.create(5),
    });
    const data = FruitMapper.toPersistence(fruit);

    expect(data).toEqual({
      name: 'Lemon',
      description: 'This is a Lemon',
      limitOfFruitToBeStored: 10,
      amount: 5,
    });
  });
});
