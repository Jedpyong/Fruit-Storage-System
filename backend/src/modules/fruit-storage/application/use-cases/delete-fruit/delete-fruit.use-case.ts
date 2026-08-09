import { FruitRepository } from '@modules/fruit-storage/domain/repositories/fruit.repository';

export class DeleteFruitUseCase {
  constructor(private readonly fruitRepository: FruitRepository) {}

  async execute(props: { name: string; forceDelete: boolean }): Promise<void> {
    const fruit = await this.fruitRepository.findByName(props.name);
    if (!fruit) {
      throw new Error('Fruit not found');
    }
    if (!fruit.canBeDeleted(props.forceDelete)) {
      throw new Error('Cannot delete fruit with remaining stock');
    }
    await this.fruitRepository.delete(props.name);
  }
}
