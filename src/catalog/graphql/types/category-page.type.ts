import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CategoryType } from './category.type';

@ObjectType('CategoryPage')
export class CategoryPageType {
  @Field(() => [CategoryType], {
    description: 'Категории текущей страницы',
  })
  items: CategoryType[];

  @Field(() => Int, {
    description: 'Общее количество категорий',
  })
  total: number;

  @Field(() => Int, {
    description: 'Текущая страница',
  })
  page: number;

  @Field(() => Int, {
    description: 'Количество элементов на странице',
  })
  limit: number;

  @Field(() => Int, {
    description: 'Общее количество страниц',
  })
  totalPages: number;
}
