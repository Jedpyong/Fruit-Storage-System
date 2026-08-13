import { AggregateRoot } from '@shared/domain/aggregate-root';
import { FruitAmount } from '../value-objects/fruit-amount.vo';
import { FruitDescription } from '../value-objects/fruit-description.vo';
import { FruitName } from '../value-objects/fruit-name.vo';
import { FruitCreatedEvent } from '../events/fruit-created.event';
import { FruitUpdatedEvent } from '../events/fruit-updated.event';
import { FruitDeletedEvent } from '../events/fruit-deleted.event';

export class Fruit extends AggregateRoot {
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
    super();
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
    const fruit = new Fruit(
      name,
      description,
      limitOfFruitToBeStored,
      FruitAmount.create(0),
    );
    fruit.addDomainEvent(new FruitCreatedEvent(this.name));
    return fruit;
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
    limitOfFruitToBeStored: FruitAmount,
    amount: FruitAmount,
  ): void {
    if (limitOfFruitToBeStored.getValue() < this.amount.getValue()) {
      throw new Error('New limit cannot be less than the current amount');
    }
    this.name = name;
    this.description = description;
    this.limitOfFruitToBeStored = limitOfFruitToBeStored;
    this.amount = amount;
    this.addDomainEvent(new FruitUpdatedEvent(this.name.getValue()));
  }

  store(amount: number): void {
    if (
      amount > this.limitOfFruitToBeStored.getValue() ||
      this.amount.getValue() + amount > this.limitOfFruitToBeStored.getValue()
    ) {
      throw new Error('Cannot store more than the storage limit');
    }

    this.amount = FruitAmount.create(this.amount.getValue() + amount);
  }

  remove(amount: number): void {
    if (amount > this.amount.getValue()) {
      throw new Error('Cannot remove more than the current amount');
    }
    if (amount < 0) {
      throw new Error('Amount to remove must be positive');
    }
    this.amount = FruitAmount.create(this.amount.getValue() - amount);
  }

  canBeDeleted(forceDelete: boolean = false): boolean {
    const deleted = forceDelete || this.amount.getValue() === 0;
    if (deleted) {
      this.addDomainEvent(new FruitDeletedEvent(this.name.getValue()));
    }
    return deleted;
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
