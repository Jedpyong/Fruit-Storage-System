import { FruitAmount } from './fruit-amount.vo';

describe('FruitAmount', () => {
  it('create a valid amount', () => {
    const rawInput = 5;
    const amount = FruitAmount.create(rawInput);
    expect(amount.getValue()).toBe(5);
  });

  it('throws an error when creating an amount with a negative number', () => {
    const rawInput = -5;
    expect(() => FruitAmount.create(rawInput)).toThrow(
      'Amount must be a positive integer number',
    );
  });

  it('throws an error when creating an amount with a non-integer number', () => {
    const rawInput = 5.5;
    expect(() => FruitAmount.create(rawInput)).toThrow(
      'Amount must be a positive integer number',
    );
  });

  it('throws an error when creating an amount with a non-number', () => {
    const rawInput = '5';
    expect(() => FruitAmount.create(rawInput as unknown as number)).toThrow(
      'Amount must be a positive integer number',
    );
  });
});
