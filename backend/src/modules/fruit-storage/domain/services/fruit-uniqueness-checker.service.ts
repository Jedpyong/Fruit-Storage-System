import { Inject, Injectable } from '@nestjs/common';
import { FruitRepository } from '../repositories/fruit.repository';

@Injectable()
export class FruitUniquenessChecker {
  constructor(
    @Inject('FruitRepository')
    private readonly fruitRepository: FruitRepository,
  ) {}

  async isUnique(name: string): Promise<boolean> {
    const existingFruit = await this.fruitRepository.findByName(
      name.trim().toLowerCase(),
    );
    return existingFruit === null;
  }
}
