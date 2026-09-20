import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersApiController } from './orders-api.controller';
import { OrdersResolver } from './graphql/orders.resolver';

@Module({
  controllers: [OrdersController, OrdersApiController],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
