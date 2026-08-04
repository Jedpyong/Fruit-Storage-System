/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FruitDescription } from './fruit-description.vo';

describe('FruitDescription', () => {
  it('create a valid description under 30 characters', () => {
    const rawInput = 'This is a valid description';
    const description = FruitDescription.create(rawInput);
    expect(description.getValue()).toBe('This is a valid description');
    expect(description.getValue().trim().length).toBeLessThanOrEqual(31);
  });

  it('throws an error when creating a description over 30 characters', () => {
    const rawInput =
      'This description is way too long and exceeds the limit of thirty characters';
    expect(() => FruitDescription.create(rawInput)).toThrow(
      'Description must not go beyond 30 characters',
    );
  });
});
