import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  customerId: string;
  status: OrderStatus;
}
