import { FruitFactory } from '@modules/fruit-storage/domain/factories/fruit.factory';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { FruitUniquenessChecker } from '@modules/fruit-storage/domain/services/fruit-uniqueness-checker.service';

export class CreateFruitUseCase {
  constructor(
    private readonly fruitRepository: FruitRepository,
    private readonly uniquenessChecker: FruitUniquenessChecker,
  ) {}

  async execute(input: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }): Promise<void> {
    const isUnique = await this.uniquenessChecker.isUnique(input.name);
    if (!isUnique) {
      throw new Error(`Fruit with name ${input.name} already exists.`);
    }

    const fruit = FruitFactory.create(input);
    await this.fruitRepository.save(fruit);
  }
}
