import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор клиента',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  customerId: number;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Позиции заказа',
    example: [
      {
        dessertId: 1,
        quantity: 1,
      },
      {
        dessertId: 2,
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
