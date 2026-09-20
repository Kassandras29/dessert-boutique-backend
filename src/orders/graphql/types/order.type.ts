import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { OrderItemType } from './order-item.type';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Статус заказа',
});

@ObjectType('Order')
export class OrderType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор заказа',
  })
  id: number;

  @Field(() => OrderStatus, {
    description: 'Статус заказа',
  })
  status: OrderStatus;

  @Field(() => GraphQLISODateTime, {
    description: 'Дата создания заказа',
  })
  createdAt: Date;

  @Field(() => Int, {
    description: 'Идентификатор клиента',
  })
  customerId: number;

  @Field(() => [OrderItemType], {
    description: 'Позиции заказа',
  })
  items: OrderItemType[];
}
