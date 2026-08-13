/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, getOutboxCollection, stopTestApp } from './setup';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('Fruit Storage (e2e)', () => {
  let app: INestApplication;
  let fruitModel: Model<any>;
  let httpServer: any;

  beforeAll(async () => {
    app = await createTestApp();
    httpServer = app.getHttpServer();
    fruitModel = app.get(getModelToken('FruitDocument'));
  });
  afterEach(async () => {
    await fruitModel.deleteMany({});
  });
  afterAll(async () => {
    await stopTestApp(app);
  });

  const graphql = (query: string) =>
    request(httpServer).post('/graphql').send({ query });
  describe('createFruitForFruitStorage', () => {
    it('creates lemon successfully and emits a domain event', async () => {
      const res = await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
            amount
          }
        }
      `);
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.createFruitForFruitStorage).toEqual({
        name: 'lemon',
        amount: 0,
      });
      const outbox = getOutboxCollection(app);
      const event = await outbox.findOne({ eventType: 'FruitCreated' });
      expect(event).not.toBeNull();
      expect(event?.payload.fruitName).toBe('lemon');
    });

    it('fails when description exceeds 30 characters', async () => {
      const res = await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "lemon2"
            description: "this is a fruit with a very long description"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
      expect(res.body.errors).toBeDefined();
      expect(res.body.data.createFruitForFruitStorage).toBeNull();
    });

    it('fails when creating the same fruit name twice', async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "duplicate-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);

      const res = await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "duplicate-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('updateFruitForFruitStorage', () => {
    beforeEach(async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "update-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
    });
    it('updates the description successfully', async () => {
      const res = await graphql(`
        mutation {
          updateFruitForFruitStorage(
            name: "update-lemon"
            description: "updated description"
            limitOfFruitToBeStored: 10
          ) {
            description
          }
        }
      `);
      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.updateFruitForFruitStorage.description).toBe(
        'updated description',
      );
    });

    it('fails when the new description exceeds 30 characters', async () => {
      const res = await graphql(`
        mutation {
          updateFruitForFruitStorage(
            name: "update-lemon"
            description: "updated lemon with a long description"
            limitOfFruitToBeStored: 10
          ) {
            description
          }
        }
      `);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('deleteFruitFromFruitStorage', () => {
    beforeEach(async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "delete-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
      await graphql(`
        mutation {
          storeFruitToFruitStorage(name: "delete-lemon", amount: 5) {
            amount
          }
        }
      `);
    });

    it('fails to delete when stock remains and forceDelete is false', async () => {
      const res = await graphql(`
        mutation {
          deleteFruitFromFruitStorage(name: "delete-lemon", forceDelete: false)
        }
      `);

      expect(res.body.errors).toBeDefined();
    });

    it('deletes successfully with forceDelete=true and emits a domain event', async () => {
      const res = await graphql(`
        mutation {
          deleteFruitFromFruitStorage(name: "delete-lemon", forceDelete: true)
        }
      `);

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.deleteFruitFromFruitStorage).toBe(true);

      const findRes = await graphql(`
        query {
          findFruit(name: "delete-lemon") {
            name
          }
        }
      `);
      expect(findRes.body.errors).toBeDefined(); // confirms it's actually gone
    });
  });

  describe('storeFruitToFruitStorage', () => {
    beforeEach(async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "store-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
      await graphql(`
        mutation {
          storeFruitToFruitStorage(name: "store-lemon", amount: 5) {
            amount
          }
        }
      `);
    });

    it('passes when storing within the limit', async () => {
      const res = await graphql(`
        mutation {
          storeFruitToFruitStorage(name: "store-lemon", amount: 3) {
            amount
          }
        }
      `);

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.storeFruitToFruitStorage.amount).toBe(8);
    });

    it('fails when storing above the limit', async () => {
      const res = await graphql(`
        mutation {
          storeFruitToFruitStorage(name: "store-lemon", amount: 6) {
            amount
          }
        }
      `);

      expect(res.body.errors).toBeDefined();
    });
  });
  describe('removeFruitFromFruitStorage', () => {
    beforeEach(async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "remove-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
      await graphql(`
        mutation {
          storeFruitToFruitStorage(name: "remove-lemon", amount: 5) {
            amount
          }
        }
      `);
    });

    it('passes when removing exactly the amount in stock', async () => {
      const res = await graphql(`
        mutation {
          removeFruitFromFruitStorage(name: "remove-lemon", amount: 5) {
            amount
          }
        }
      `);

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.removeFruitFromFruitStorage.amount).toBe(0);
    });

    it('fails when removing more than what is in stock', async () => {
      const res = await graphql(`
        mutation {
          removeFruitFromFruitStorage(name: "remove-lemon", amount: 6) {
            amount
          }
        }
      `);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('findFruit', () => {
    beforeEach(async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            name: "find-lemon"
            description: "this is a lemon"
            limitOfFruitToBeStored: 10
          ) {
            name
          }
        }
      `);
    });

    it('returns the fruit when it exists', async () => {
      await graphql(`
        mutation {
          createFruitForFruitStorage(
            input: {
              name: "find-lemon"
              description: "Fresh yellow lemon"
              limitOfFruitToBeStored: 10
            }
          ) {
            name
          }
        }
      `);
      const res = await graphql(`
        query {
          findFruit(name: "find-lemon") {
            name
          }
        }
      `);

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data.findFruit.name).toBe('find-lemon');
    });

    it('throws an error when the fruit does not exist', async () => {
      const res = await graphql(`
        query {
          findFruit(name: "not a lemon") {
            name
          }
        }
      `);

      expect(res.body.errors).toBeDefined();
      expect(res.body.data.findFruit).toBeNull();
    });
  });
});
