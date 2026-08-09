import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';

export class RemoveFruitUseCase {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async execute(props: { name: string; amount: number }): Promise<Fruit> {
    const fruit = await this.fruitRepository.findByName(props.name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    fruit.remove(props.amount);
    await this.fruitRepository.save(fruit);
    return fruit;
  }
}
