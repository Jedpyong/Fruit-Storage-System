import { Fruit } from "./fruit-types";
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL as string;
async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  console.log("SENDING QUERY:", query);
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  console.log("GRAPHQL_URL:", GRAPHQL_URL);
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message ?? "Request failed");
  }
  return json.data;
}

export async function listFruits(): Promise<Fruit[]> {
  const data = await graphqlRequest<{ listFruits: Fruit[] }>(
    `query {listFruits{name description limitOfFruitToBeStored amount}}`
  );
  return data.listFruits;
}

export async function createFruit(input: {
  name: string;
  description: string;
  limitOfFruitToBeStored: number;
}): Promise<Fruit> {
  const data = await graphqlRequest<{ createFruitForFruitStorage: Fruit }>(
    `mutation($name: String!, $description: String!, $limitOfFruitToBeStored: Int!) {
        createFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limitOfFruitToBeStored) {
        name description limitOfFruitToBeStored amount
        }
    }`,
    {
      name: input.name,
      description: input.description,
      limitOfFruitToBeStored: input.limitOfFruitToBeStored,
    }
  );
  return data.createFruitForFruitStorage;
}

export async function storeFruit(name: string, amount: number): Promise<Fruit> {
  const data = await graphqlRequest<{ storeFruitToFruitStorage: Fruit }>(
    `
    mutation($name: String!, $amount: Int!) {
      storeFruitToFruitStorage(name: $name, amount: $amount) {
        name description limitOfFruitToBeStored amount
      }
    }
  `,
    { name, amount }
  );
  return data.storeFruitToFruitStorage;
}

export async function removeFruit(
  name: string,
  amount: number
): Promise<Fruit> {
  const data = await graphqlRequest<{ removeFruitFromFruitStorage: Fruit }>(
    `
    mutation($name: String!, $amount: Int!) {
      removeFruitFromFruitStorage(name: $name, amount: $amount) {
        name description limitOfFruitToBeStored amount
      }
    }
  `,
    { name, amount }
  );
  return data.removeFruitFromFruitStorage;
}

export async function deleteFruit(
  name: string,
  forceDelete: boolean
): Promise<void> {
  await graphqlRequest(
    `
    mutation($name: String!, $force: Boolean!) {
      deleteFruitFromFruitStorage(name: $name, forceDelete: $force)
    }
  `,
    { name, force: forceDelete }
  );
}

export async function updateFruit(input: {
  name: string;
  description: string;
  limitOfFruitToBeStored: number;
}): Promise<Fruit> {
  const data = await graphqlRequest<{ updateFruitForFruitStorage: Fruit }>(
    `mutation UpdateFruit($name: String!, $description: String!, $limit: Int!) {
      updateFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limit) {
        name
        description
        limitOfFruitToBeStored
        amount
      }
    }`,
    {
      name: input.name,
      description: input.description,
      limit: input.limitOfFruitToBeStored,
    }
  );
  return data.updateFruitForFruitStorage;
}
