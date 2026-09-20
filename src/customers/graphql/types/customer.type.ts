import { Field, Int, ObjectType } from '@nestjs/graphql';

import { OrderType } from '../../../orders/graphql/types/order.type';
import { ReviewType } from '../../../reviews/graphql/types/review.type';

@ObjectType('Customer')
export class CustomerType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор клиента',
  })
  id: number;

  @Field(() => String, {
    description: 'Имя клиента',
  })
  name: string;

  @Field(() => String, {
    description: 'Электронная почта клиента',
  })
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Телефон клиента',
  })
  phone?: string | null;

  @Field(() => [OrderType], {
    description: 'Заказы клиента',
  })
  orders: OrderType[];

  @Field(() => [ReviewType], {
    description: 'Отзывы клиента',
  })
  reviews: ReviewType[];
}
