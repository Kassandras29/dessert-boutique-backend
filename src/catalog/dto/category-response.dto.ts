import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Торты',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Торты только на заказ',
    nullable: true,
  })
  description: string | null;
}
