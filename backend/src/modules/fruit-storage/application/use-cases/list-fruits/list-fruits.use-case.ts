import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';

export class ListFruitsUseCase {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async execute(): Promise<Fruit[]> {
    return this.fruitRepository.findAll();
  }
}
