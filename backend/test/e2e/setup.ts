import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppModule } from '../../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

let replSet: MongoMemoryReplSet;

export async function createTestApp(): Promise<INestApplication> {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replSet.getUri();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(MongooseModule)
    .useModule(
      MongooseModule.forRoot(`${uri}fruit-storage-test?directConnection=true`),
    )
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

export async function stopTestApp(app: INestApplication): Promise<void> {
  await app.close();
  await replSet.stop();
}

export function getOutboxCollection(app: INestApplication) {
  const connection = app.get<Connection>(getConnectionToken());
  return connection.collection('outbox_messages');
}
