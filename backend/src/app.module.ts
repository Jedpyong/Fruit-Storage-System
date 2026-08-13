import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { schema } from './modules/fruit-storage/infrastructure/graphql/schema';
import { FruitStorageModule } from '@modules/fruit-storage/fruit-storage.module';
import { CreateFruitUseCase } from '@modules/fruit-storage/application/use-cases/create-fruit/create-fruit.use-case';
import { DeleteFruitUseCase } from '@modules/fruit-storage/application/use-cases/delete-fruit/delete-fruit.use-case';
import { FindFruitUseCase } from '@modules/fruit-storage/application/use-cases/find-fruit/find-fruit.use-case';
import { ListFruitsUseCase } from '@modules/fruit-storage/application/use-cases/list-fruits/list-fruits.use-case';
import { RemoveFruitUseCase } from '@modules/fruit-storage/application/use-cases/remove-fruit/remove-fruit.use-case';
import { StoreFruitUseCase } from '@modules/fruit-storage/application/use-cases/store-fruit/store-fruit.use-case';
import { UpdateFruitUseCase } from '@modules/fruit-storage/application/use-cases/update-fruit/update-fruit.use-case';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/fruit-storage?directConnection=true',
    ),
    FruitStorageModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (moduleRef: ModuleRef) => ({
        schema,
        context: () => ({
          createFruitUseCase: moduleRef.get(CreateFruitUseCase, {
            strict: false,
          }),
          updateFruitUseCase: moduleRef.get(UpdateFruitUseCase, {
            strict: false,
          }),
          deleteFruitUseCase: moduleRef.get(DeleteFruitUseCase, {
            strict: false,
          }),
          storeFruitUseCase: moduleRef.get(StoreFruitUseCase, {
            strict: false,
          }),
          removeFruitUseCase: moduleRef.get(RemoveFruitUseCase, {
            strict: false,
          }),
          findFruitUseCase: moduleRef.get(FindFruitUseCase, { strict: false }),
          listFruitsUseCase: moduleRef.get(ListFruitsUseCase, {
            strict: false,
          }),
        }),
      }),
      inject: [ModuleRef],
    }),
  ],
})
export class AppModule {}
