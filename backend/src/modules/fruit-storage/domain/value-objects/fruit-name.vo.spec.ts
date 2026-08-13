import { FruitName } from './fruit-name.vo';

describe('FruitName', () => {
  it('create a valid and normalized name', () => {
    const rawInput = 'Apple';
    const name = FruitName.create(rawInput);
    expect(name.getValue()).toBe('apple');
  });

  it('throws an error when creating a name with empty string', () => {
    const rawInput = '';
    expect(() => FruitName.create(rawInput)).toThrow('Name must not be empty');
  });

  it('throws an error when creating a name with numbers', () => {
    const rawInput = 'Apple123';
    expect(() => FruitName.create(rawInput)).toThrow(
      'Name must not contain numbers',
    );
  });

  it('throws an error when creating a name with only a number not letter', () => {
    const rawInput = '123';
    expect(() => FruitName.create(rawInput)).toThrow(
      'Name must not contain numbers',
    );
  });
});
