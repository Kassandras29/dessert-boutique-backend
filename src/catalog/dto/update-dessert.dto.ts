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

export class UpdateDessertDto {
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
    example: 250,
    description: 'Цена десерта',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 3,
    description: 'Идентификатор категории',
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
