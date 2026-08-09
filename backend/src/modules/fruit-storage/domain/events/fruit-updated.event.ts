export class FruitUpdatedEvent {
  readonly eventType = 'FruitUpdated';
  constructor(
    public readonly fruitName: string,
    public readonly occuredAt: Date = new Date(),
  ) {}
}
