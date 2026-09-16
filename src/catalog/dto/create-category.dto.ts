import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Пирожные',
    description: 'Название категории',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Порционные десерты',
    description: 'Описание категории',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
