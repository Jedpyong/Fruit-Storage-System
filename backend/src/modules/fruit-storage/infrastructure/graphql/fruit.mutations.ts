/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mutationField, nonNull, stringArg, intArg, booleanArg } from 'nexus';
import { toGraphQLFruit } from './fruit.presenter';

export const createFruitForFruitStorage = mutationField(
  'createFruitForFruitStorage',
  {
    type: 'Fruit',
    args: {
      name: nonNull(stringArg()),
      description: nonNull(stringArg()),
      limitOfFruitToBeStored: nonNull(intArg()),
    },
    resolve: async (_root, args, ctx) => {
      const fruit = await ctx.createFruitUseCase.execute({
        name: args.name,
        description: args.description,
        limitOfFruitToBeStored: args.limitOfFruitToBeStored,
      });
      return toGraphQLFruit(fruit);
    },
  },
);

export const updateFruitForFruitStorage = mutationField(
  'updateFruitForFruitStorage',
  {
    type: 'Fruit',
    args: {
      name: nonNull(stringArg()),
      description: nonNull(stringArg()),
      limitOfFruitToBeStored: nonNull(intArg()),
    },
    resolve: async (_root, args, ctx) => {
      const fruit = await ctx.updateFruitUseCase.execute({
        name: args.name,
        description: args.description,
        limitOfFruitToBeStored: args.limitOfFruitToBeStored,
      });
      return toGraphQLFruit(fruit);
    },
  },
);

export const deleteFruitFromStorage = mutationField(
  'deleteFruitFromFruitStorage',
  {
    type: 'Boolean',
    args: {
      name: nonNull(stringArg()),
      forceDelete: nonNull(booleanArg()),
    },
    resolve: async (_root, args, ctx) => {
      await ctx.deleteFruitUseCase.execute({
        name: args.name,
        forceDelete: args.forceDelete,
      });
      return true;
    },
  },
);

export const storeFruitToStorage = mutationField('storeFruitToFruitStorage', {
  type: 'Fruit',
  args: { name: nonNull(stringArg()), amount: nonNull(intArg()) },
  resolve: async (_root, args, ctx) => {
    const fruit = await ctx.storeFruitUseCase.execute(args);
    return toGraphQLFruit(fruit);
  },
});

export const removeFruitFromStorage = mutationField(
  'removeFruitFromFruitStorage',
  {
    type: 'Fruit',
    args: { name: nonNull(stringArg()), amount: nonNull(intArg()) },
    resolve: async (_root, args, ctx) => {
      const fruit = await ctx.removeFruitUseCase.execute(args);
      return toGraphQLFruit(fruit);
    },
  },
);
