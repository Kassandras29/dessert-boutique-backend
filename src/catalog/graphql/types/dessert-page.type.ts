import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DessertType } from './dessert.type';

@ObjectType('DessertPage')
export class DessertPageType {
  @Field(() => [DessertType], {
    description: 'Десерты текущей страницы',
  })
  items: DessertType[];

  @Field(() => Int, {
    description: 'Общее количество десертов',
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
