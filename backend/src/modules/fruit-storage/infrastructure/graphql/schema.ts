import { makeSchema } from 'nexus';
import { join } from 'path';
import { Fruit } from '@modules/fruit-storage/infrastructure/graphql/fruit.type';
import * as mutations from '@modules/fruit-storage/infrastructure/graphql/fruit.mutations';
import * as queries from '@modules/fruit-storage/infrastructure/graphql/fruit.queries';

export const schema = makeSchema({
  types: [Fruit, ...Object.values(mutations), ...Object.values(queries)],
  outputs: {
    schema: join(__dirname, '../../schema.graphql'),
    typegen: join(__dirname, '../../nexus-typegen.ts'),
  },
});
