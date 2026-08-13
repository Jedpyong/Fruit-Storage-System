export class FruitAmount {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  public static create(value: number): FruitAmount {
    if (!Number.isInteger(value) || value < 0) {
      console.log('Invalid amount value:', value);
      throw new Error('Amount must be a positive integer number');
    }
    return new FruitAmount(value);
  }

  public getValue(): number {
    return this._value;
  }
}
