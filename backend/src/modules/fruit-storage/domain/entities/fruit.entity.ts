import { FruitAmount } from '../value-objects/fruit-amount.vo';
import { FruitDescription } from '../value-objects/fruit-description.vo';
import { FruitName } from '../value-objects/fruit-name.vo';

export class Fruit {
  private name: FruitName;
  private description: FruitDescription;
  private amount: FruitAmount;
  private limitOfFruitToBeStored: FruitAmount;

  constructor(
    name: FruitName,
    description: FruitDescription,
    limitOfFruitToBeStored: FruitAmount,
    amount: FruitAmount,
  ) {
    this.name = name;
    this.description = description;
    this.amount = amount;
    this.limitOfFruitToBeStored = limitOfFruitToBeStored;
  }

  static createNew(
    name: FruitName,
    description: FruitDescription,
    limitOfFruitToBeStored: FruitAmount,
  ): Fruit {
    if (limitOfFruitToBeStored.getValue() < 0) {
      throw new Error('Amount must be a positive integer number');
    }
    return new Fruit(
      name,
      description,
      limitOfFruitToBeStored,
      FruitAmount.create(0),
    );
  }

  static reconstitute(props: {
    name: FruitName;
    description: FruitDescription;
    amount: FruitAmount;
    limitOfFruitToBeStored: FruitAmount;
  }): Fruit {
    return new Fruit(
      props.name,
      props.description,
      props.limitOfFruitToBeStored,
      props.amount,
    );
  }

  update(
    name: FruitName,
    description: FruitDescription,
    limit: FruitAmount,
  ): void {
    if (limit.getValue() < 0) {
      throw new Error('Amount must be a positive integer number');
    }
    if (limit.getValue() < this.amount.getValue()) {
      throw new Error('New limit cannot be less than the current amount');
    }
    this.name = name;
    this.description = description;
    this.limitOfFruitToBeStored = limit;
  }

  store(amount: number): void {
    if (
      amount > this.limitOfFruitToBeStored.getValue() ||
      this.amount.getValue() + amount > this.limitOfFruitToBeStored.getValue()
    ) {
      throw new Error('Cannot store more than the storage limit');
    }
    if (amount < 0) {
      throw new Error('Amount must be a positive integer number');
    }

    this.amount = FruitAmount.create(this.amount.getValue() + amount);
  }

  remove(amount: number): void {
    if (amount > this.amount.getValue()) {
      throw new Error('Cannot remove more than the current amount');
    }
    if (amount < 0) {
      throw new Error('Amount must be a positive integer number');
    }
    this.amount = FruitAmount.create(this.amount.getValue() - amount);
  }

  canBeDeleted(forceDelete: boolean = false): boolean {
    return forceDelete || this.amount.getValue() === 0;
  }

  getName(): FruitName {
    return this.name;
  }
  getDescription(): FruitDescription {
    return this.description;
  }
  getAmount(): FruitAmount {
    return this.amount;
  }
  getLimitOfFruitToBeStored(): FruitAmount {
    return this.limitOfFruitToBeStored;
  }
}
