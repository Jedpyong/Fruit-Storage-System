import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ListFruitsUseCase {
  constructor(
    @Inject('FruitRepository')
    private readonly fruitRepository: FruitRepository,
  ) {}

  async execute(): Promise<Fruit[]> {
    return this.fruitRepository.findAll();
  }
}
