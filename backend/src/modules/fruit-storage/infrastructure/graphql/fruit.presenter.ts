import { Fruit as FruitEntity } from '@modules/fruit-storage/domain/entities/fruit.entity';

export function toGraphQLFruit(fruit: FruitEntity) {
  return {
    name: fruit.getName().getValue(),
    description: fruit.getDescription().getValue(),
    limitOfFruitToBeStored: fruit.getLimitOfFruitToBeStored().getValue(),
    amount: fruit.getAmount().getValue(),
  };
}
