import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { CustomerResponseDto } from '../../customers/dto/customer-response.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.NEW,
  })
  status: OrderStatus;

  @ApiProperty({
    example: '2026-09-16T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: 1,
  })
  customerId: number;

  @ApiProperty({
    type: CustomerResponseDto,
  })
  customer: CustomerResponseDto;

  @ApiProperty({
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];
}
