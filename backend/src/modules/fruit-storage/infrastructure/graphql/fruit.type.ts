import { objectType } from 'nexus';

export const Fruit = objectType({
  name: 'Fruit',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('description');
    t.nonNull.int('limitOfFruitToBeStored');
    t.nonNull.int('amount');
  },
});
