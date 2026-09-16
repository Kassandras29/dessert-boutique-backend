import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDessertResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Молочная девочка',
  })
  name: string;
}

export class OrderItemResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    example: '1501.00',
  })
  price: string;

  @ApiProperty({
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    example: 1,
  })
  dessertId: number;

  @ApiProperty({
    type: OrderItemDessertResponseDto,
  })
  dessert: OrderItemDessertResponseDto;
}
