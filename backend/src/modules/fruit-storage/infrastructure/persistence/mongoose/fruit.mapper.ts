import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { FruitDocument } from './fruit.schema';

export class FruitMapper {
  static toDomain(raw: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    amount: number;
  }): Fruit {
    return Fruit.reconstitute({
      name: FruitName.create(raw.name),
      description: FruitDescription.create(raw.description),
      limitOfFruitToBeStored: FruitAmount.create(raw.limitOfFruitToBeStored),
      amount: FruitAmount.create(raw.amount),
    });
  }

  static toPersistence(fruit: Fruit): FruitDocument {
    return {
      name: fruit.getName().getValue(),
      description: fruit.getDescription().getValue(),
      limitOfFruitToBeStored: fruit.getLimitOfFruitToBeStored().getValue(),
      amount: fruit.getAmount().getValue(),
    };
  }
}
