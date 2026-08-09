export class FruitDeletedEvent {
  readonly eventType = 'FruitDeleted';
  constructor(
    public readonly fruitName: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
