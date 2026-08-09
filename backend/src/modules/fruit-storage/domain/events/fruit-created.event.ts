export class FruitCreatedEvent {
  readonly eventType = 'FruitCreated';
  constructor(
    public readonly fruitName: string,
    public readonly occuredAt: Date = new Date(),
  ) {}
}
