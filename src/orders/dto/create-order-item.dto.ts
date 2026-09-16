import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор десерта',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  dessertId: number;

  @ApiProperty({
    example: 2,
    description: 'Количество десертов',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
