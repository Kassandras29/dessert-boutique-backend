import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, {
    description: 'Название категории',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Описание категории',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
