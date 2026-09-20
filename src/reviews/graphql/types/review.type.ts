import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { DessertType } from '../../../catalog/graphql/types/dessert.type';

@ObjectType('Review')
export class ReviewType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор отзыва',
  })
  id: number;

  @Field(() => Int, {
    description: 'Оценка от 1 до 5',
  })
  rating: number;

  @Field(() => String, {
    description: 'Текст отзыва',
  })
  text: string;

  @Field(() => GraphQLISODateTime, {
    description: 'Дата создания отзыва',
  })
  createdAt: Date;

  @Field(() => Int, {
    description: 'Идентификатор клиента',
  })
  customerId: number;

  @Field(() => Int, {
    description: 'Идентификатор десерта',
  })
  dessertId: number;

  @Field(() => DessertType, {
    description: 'Десерт, к которому относится отзыв',
  })
  dessert: DessertType;
}
