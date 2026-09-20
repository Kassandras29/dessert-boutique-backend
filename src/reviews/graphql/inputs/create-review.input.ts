import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int, {
    description: 'Оценка от 1 до 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field(() => String, {
    description: 'Текст отзыва',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field(() => Int, {
    description: 'Идентификатор клиента',
  })
  @IsInt()
  @Min(1)
  customerId: number;

  @Field(() => Int, {
    description: 'Идентификатор десерта',
  })
  @IsInt()
  @Min(1)
  dessertId: number;
}
