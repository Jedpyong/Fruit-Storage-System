export class FruitDescription {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): FruitDescription {
    if (value.trim().length > 30) {
      throw new Error('Description must not go beyond 30 characters');
    }
    return new FruitDescription(value);
  }

  public getValue(): string {
    return this._value;
  }
}
