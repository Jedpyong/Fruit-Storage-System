import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';
import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';
import { FruitAmount } from '@modules/fruit-storage/domain/value-objects/fruit-amount.vo';
import { FruitDescription } from '@modules/fruit-storage/domain/value-objects/fruit-description.vo';
import { FruitName } from '@modules/fruit-storage/domain/value-objects/fruit-name.vo';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateFruitUseCase {
  constructor(
    @Inject('FruitRepository')
    private readonly fruitRepository: FruitRepository,
  ) {}

  async execute(props: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  }): Promise<Fruit> {
    const fruit = await this.fruitRepository.findByName(props.name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    fruit.update(
      FruitName.create(props.name),
      FruitDescription.create(props.description),
      FruitAmount.create(props.limitOfFruitToBeStored),
      fruit.getAmount(),
    );

    await this.fruitRepository.save(fruit);
    return fruit;
  }
}
