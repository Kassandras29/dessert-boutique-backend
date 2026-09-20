import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { DessertType } from '../../../catalog/graphql/types/dessert.type';

@ObjectType('OrderItem')
export class OrderItemType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор позиции заказа',
  })
  id: number;

  @Field(() => Int, {
    description: 'Количество десертов',
  })
  quantity: number;

  @Field(() => Float, {
    description: 'Цена десерта на момент оформления заказа',
  })
  price: number;

  @Field(() => Int, {
    description: 'Идентификатор заказа',
  })
  orderId: number;

  @Field(() => Int, {
    description: 'Идентификатор десерта',
  })
  dessertId: number;

  @Field(() => DessertType, {
    description: 'Десерт позиции заказа',
  })
  dessert: DessertType;
}
