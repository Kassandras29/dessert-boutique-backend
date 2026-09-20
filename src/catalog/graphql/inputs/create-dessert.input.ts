import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateDessertInput {
  @Field(() => String, {
    description: 'Название десерта',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Описание десерта',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, {
    description: 'Цена десерта',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Int, {
    description: 'Идентификатор категории',
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
