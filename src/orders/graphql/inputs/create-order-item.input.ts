import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int, {
    description: 'Идентификатор десерта',
  })
  @IsInt()
  @Min(1)
  dessertId: number;

  @Field(() => Int, {
    description: 'Количество десертов',
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
