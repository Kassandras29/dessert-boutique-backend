import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderType } from './order.type';

@ObjectType('OrderPage')
export class OrderPageType {
  @Field(() => [OrderType], {
    description: 'Заказы текущей страницы',
  })
  items: OrderType[];

  @Field(() => Int, {
    description: 'Общее количество заказов',
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
