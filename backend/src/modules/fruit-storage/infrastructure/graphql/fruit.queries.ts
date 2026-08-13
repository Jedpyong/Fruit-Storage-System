/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { queryField, nonNull, stringArg, list } from 'nexus';
import { toGraphQLFruit } from './fruit.presenter';
import { Fruit } from '@modules/fruit-storage/domain/entities/fruit.entity';

export const findFruit = queryField('findFruit', {
  type: 'Fruit',
  args: { name: nonNull(stringArg()) },
  resolve: async (_root, args, ctx) => {
    const fruit: Fruit = await ctx.findFruitUseCase.execute({
      name: args.name,
    });
    return toGraphQLFruit(fruit);
  },
});

export const listFruits = queryField('listFruits', {
  type: list('Fruit'),
  resolve: async (_root, _args, ctx) => {
    const fruits: Fruit[] = await ctx.listFruitsUseCase.execute();
    return fruits.map(toGraphQLFruit);
  },
});
