import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCustomerInput {
  @Field(() => String, {
    description: 'Имя клиента',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, {
    description: 'Электронная почта клиента',
  })
  @IsEmail()
  email: string;

  @Field(() => String, {
    nullable: true,
    description: 'Телефон клиента',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
