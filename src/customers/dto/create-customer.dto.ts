import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Ирина Бородина',
    description: 'Имя клиента',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'irina@example.com',
    description: 'Электронная почта клиента',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+79991234567',
    description: 'Телефон клиента',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
