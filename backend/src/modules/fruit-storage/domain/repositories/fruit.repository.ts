import { Fruit } from '../entities/fruit.entity';

export interface FruitRepository {
  findByName(name: string): Promise<Fruit | null>;
  findAll(): Promise<Fruit[]>;
  save(fruit: Fruit): Promise<void>;
  delete(name: string): Promise<void>;
}
