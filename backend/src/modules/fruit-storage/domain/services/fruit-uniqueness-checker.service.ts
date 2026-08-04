import { FruitRepository } from '../repositories/fruit.repository';

export class FruitUniquenessCheckerService {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async isUnique(name: string): Promise<boolean> {
    const existingFruit = await this.fruitRepository.findByName(name);
    return existingFruit === null;
  }
}
