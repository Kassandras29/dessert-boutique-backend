import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Dessert')
export class DessertType {
  @Field(() => Int, {
    description: 'Уникальный идентификатор десерта',
  })
  id: number;

  @Field(() => String, {
    description: 'Название десерта',
  })
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Описание десерта',
  })
  description?: string | null;

  @Field(() => Float, {
    description: 'Цена десерта',
  })
  price: number;

  @Field(() => Int, {
    description: 'Идентификатор категории',
  })
  categoryId: number;
}
