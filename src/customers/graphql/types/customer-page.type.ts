import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CustomerType } from './customer.type';

@ObjectType('CustomerPage')
export class CustomerPageType {
  @Field(() => [CustomerType], {
    description: 'Клиенты текущей страницы',
  })
  items: CustomerType[];

  @Field(() => Int, {
    description: 'Общее количество клиентов',
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
