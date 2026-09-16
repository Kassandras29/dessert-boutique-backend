import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';

export class DessertResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Молочная девочка',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Нежный классический торт',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: '1501.00',
    description: 'Цена хранится в PostgreSQL как Decimal',
  })
  price: string;

  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    type: CategoryResponseDto,
  })
  category: CategoryResponseDto;
}
