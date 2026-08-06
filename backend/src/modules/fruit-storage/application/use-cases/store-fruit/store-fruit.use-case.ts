import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';

export class StoreFruitUseCase {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async execute(props: { name: string; amount: number }) {
    const fruit = await this.fruitRepository.findByName(props.name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    fruit.store(props.amount);
    await this.fruitRepository.save(fruit);
  }
}
