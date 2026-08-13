import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveFruitUseCase {
  constructor(
    @Inject('FruitRepository')
    private readonly fruitRepository: FruitRepository,
  ) {}

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
