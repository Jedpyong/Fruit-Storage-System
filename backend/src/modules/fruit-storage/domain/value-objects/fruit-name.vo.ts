export class FruitName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): FruitName {
    if (value.trim().length === 0) {
      throw new Error('Name must not be empty');
    }
    if (/\d/.test(value)) {
      throw new Error('Name must not contain numbers');
    }
    return new FruitName(value.trim().toLowerCase());
  }

  public getValue(): string {
    return this._value;
  }
}
