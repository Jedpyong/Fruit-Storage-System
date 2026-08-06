import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';

export class FindFruitUseCase {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async execute(fruitName: string): Promise<Fruit> {
    const fruit = await this.fruitRepository.findByName(fruitName);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    return fruit;
  }
}
