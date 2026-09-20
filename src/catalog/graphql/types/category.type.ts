import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DessertType } from './dessert.type';

@ObjectType('Category')
export class CategoryType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор категории',
  })
  id: number;

  @Field(() => String, {
    description: 'Название категории',
  })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Описание категории',
  })
  description?: string | null;

  @Field(() => [DessertType], {
    description: 'Десерты данной категории',
  })
  products: DessertType[];
}
