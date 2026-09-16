import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersApiController } from './orders-api.controller';

@Module({
  controllers: [OrdersController, OrdersApiController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
