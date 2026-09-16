import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор клиента',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  customerId: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    description: 'Статус заказа',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
