import { Fruit } from '../entities/fruit.entity';
import { FruitAmount } from '../value-objects/fruit-amount.vo';
import { FruitDescription } from '../value-objects/fruit-description.vo';
import { FruitName } from '../value-objects/fruit-name.vo';

export class FruitFactory {
  public static create(props: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }) {
    const fruitName = FruitName.create(props.name);
    const fruitDescription = FruitDescription.create(props.description);
    const fruitLimit = FruitAmount.create(props.limitOfFruitToBeStored);

    return Fruit.createNew(fruitName, fruitDescription, fruitLimit);
  }
}
