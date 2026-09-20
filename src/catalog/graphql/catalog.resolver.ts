import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CatalogService } from '../catalog.service';
import { PaginationArgs } from '../../common/graphql/pagination.args';

import { CategoryType } from './types/category.type';
import { DessertType } from './types/dessert.type';
import { CategoryPageType } from './types/category-page.type';
import { DessertPageType } from './types/dessert-page.type';

import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CreateDessertInput } from './inputs/create-dessert.input';
import { UpdateDessertInput } from './inputs/update-dessert.input';

@Resolver(() => CategoryType)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Query(() => DessertPageType, {
    description: 'Получить страницу десертов',
  })
  async desserts(@Args() pagination: PaginationArgs) {
    const result = await this.catalogService.findDessertsPage(
      pagination.page,
      pagination.limit,
    );

    return {
      items: result.items.map((dessert) => ({
        ...dessert,
        price: Number(dessert.price),
      })),
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(result.total / pagination.limit),
    };
  }

  @Query(() => DessertType, {
    description: 'Получить десерт по идентификатору',
  })
  async dessert(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор десерта',
    })
    id: number,
  ) {
    const dessert = await this.catalogService.findDessertById(id);

    return {
      ...dessert,
      price: Number(dessert.price),
    };
  }

  @Query(() => CategoryPageType, {
    description: 'Получить страницу категорий',
  })
  async categories(@Args() pagination: PaginationArgs) {
    const result = await this.catalogService.findCategoriesPage(
      pagination.page,
      pagination.limit,
    );

    return {
      items: result.items,
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(result.total / pagination.limit),
    };
  }

  @Query(() => CategoryType, {
    description: 'Получить категорию по идентификатору',
  })
  async category(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор категории',
    })
    id: number,
  ) {
    return this.catalogService.findCategoryById(id);
  }

  @Mutation(() => DessertType, {
    description: 'Создать новый десерт',
  })
  async createDessert(
    @Args('input')
    input: CreateDessertInput,
  ) {
    const dessert = await this.catalogService.createDessert(input);

    return {
      ...dessert,
      price: Number(dessert.price),
    };
  }

  @Mutation(() => DessertType, {
    description: 'Изменить десерт',
  })
  async updateDessert(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор десерта',
    })
    id: number,
    @Args('input')
    input: UpdateDessertInput,
  ) {
    const dessert = await this.catalogService.updateDessert(id, input);

    return {
      ...dessert,
      price: Number(dessert.price),
    };
  }

  @Mutation(() => Boolean, {
    description: 'Удалить десерт',
  })
  async deleteDessert(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор десерта',
    })
    id: number,
  ): Promise<boolean> {
    await this.catalogService.deleteDessert(id);
    return true;
  }

  @Mutation(() => CategoryType, {
    description: 'Создать новую категорию',
  })
  async createCategory(
    @Args('input')
    input: CreateCategoryInput,
  ) {
    return this.catalogService.createCategory(input);
  }

  @Mutation(() => CategoryType, {
    description: 'Изменить категорию',
  })
  async updateCategory(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор категории',
    })
    id: number,
    @Args('input')
    input: UpdateCategoryInput,
  ) {
    return this.catalogService.updateCategory(id, input);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить категорию',
  })
  async deleteCategory(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор категории',
    })
    id: number,
  ): Promise<boolean> {
    await this.catalogService.deleteCategory(id);
    return true;
  }

  @ResolveField(() => [DessertType], {
    name: 'products',
    description: 'Получить десерты категории',
  })
  async products(@Parent() category: CategoryType) {
    const products = await this.catalogService.findDessertsByCategory(
      category.id,
    );

    return products.map((dessert) => ({
      ...dessert,
      price: Number(dessert.price),
    }));
  }
}
