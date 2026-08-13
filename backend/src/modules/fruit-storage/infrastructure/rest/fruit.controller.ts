import { CreateFruitDto } from '@modules/fruit-storage/application/dto/create-fruit.dto';
import { UpdateFruitDto } from '@modules/fruit-storage/application/dto/update-fruit.dto';
import { CreateFruitUseCase } from '@modules/fruit-storage/application/use-cases/create-fruit/create-fruit.use-case';
import { DeleteFruitUseCase } from '@modules/fruit-storage/application/use-cases/delete-fruit/delete-fruit.use-case';
import { FindFruitUseCase } from '@modules/fruit-storage/application/use-cases/find-fruit/find-fruit.use-case';
import { ListFruitsUseCase } from '@modules/fruit-storage/application/use-cases/list-fruits/list-fruits.use-case';
import { RemoveFruitUseCase } from '@modules/fruit-storage/application/use-cases/remove-fruit/remove-fruit.use-case';
import { StoreFruitUseCase } from '@modules/fruit-storage/application/use-cases/store-fruit/store-fruit.use-case';
import { UpdateFruitUseCase } from '@modules/fruit-storage/application/use-cases/update-fruit/update-fruit.use-case';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { toGraphQLFruit } from '../graphql/fruit.presenter';

@Controller('fruits')
export class FruitController {
  constructor(
    private readonly createFruit: CreateFruitUseCase,
    private readonly updateFruit: UpdateFruitUseCase,
    private readonly deleteFruit: DeleteFruitUseCase,
    private readonly storeFruit: StoreFruitUseCase,
    private readonly removeFruit: RemoveFruitUseCase,
    private readonly findFruit: FindFruitUseCase,
    private readonly listFruits: ListFruitsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateFruitDto) {
    const fruit = await this.createFruit.execute(dto);
    return toGraphQLFruit(fruit);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    const fruit = await this.findFruit.execute(name);
    return toGraphQLFruit(fruit);
  }

  @Get()
  async findAll() {
    const fruits = await this.listFruits.execute();
    return fruits.map(toGraphQLFruit);
  }

  @Put(':name')
  async update(@Param('name') name: string, @Body() dto: UpdateFruitDto) {
    const fruit = await this.updateFruit.execute({ name, ...dto });
    return toGraphQLFruit(fruit);
  }

  @Delete(':name')
  async delete(
    @Param('name') name: string,
    @Query('forceDelete') forceDelete: boolean,
  ) {
    await this.deleteFruit.execute({
      name,
      forceDelete: forceDelete === true,
    });
    return { deleted: true };
  }

  @Post(':name/store')
  async store(@Param('name') name: string, @Body('amount') amount: number) {
    const fruit = await this.storeFruit.execute({ name, amount });
    return toGraphQLFruit(fruit);
  }

  @Post(':name/remove')
  async removeStock(
    @Param('name') name: string,
    @Body('amount') amount: number,
  ) {
    const fruit = await this.removeFruit.execute({ name, amount });
    return toGraphQLFruit(fruit);
  }
}
