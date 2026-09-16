import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateDessertDto {
  @ApiProperty({
    example: 'Эклер лимонный',
    description: 'Название десерта',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Заварное пирожное с лимонным кремом',
    description: 'Описание десерта',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 200,
    description: 'Цена десерта',
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 1,
    description: 'Идентификатор категории',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
