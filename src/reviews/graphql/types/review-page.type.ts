import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReviewType } from './review.type';

@ObjectType('ReviewPage')
export class ReviewPageType {
  @Field(() => [ReviewType], {
    description: 'Отзывы текущей страницы',
  })
  items: ReviewType[];

  @Field(() => Int, {
    description: 'Общее количество отзывов',
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
