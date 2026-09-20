import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 1,
    description: 'Номер страницы',
  })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field(() => Int, {
    defaultValue: 10,
    description: 'Количество элементов на странице',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
