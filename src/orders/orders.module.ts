import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersApiController } from './orders-api.controller';
import { OrdersResolver } from './graphql/orders.resolver';
import { OrderOwnerOrAdminGuard } from './order-owner-or-admin.guard';
import { AuthRedirectMiddleware } from '../auth/auth-redirect.middleware';

@Module({
  controllers: [OrdersController, OrdersApiController],
  providers: [OrdersService, OrdersResolver, OrderOwnerOrAdminGuard],
  exports: [OrdersService],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthRedirectMiddleware).forRoutes(OrdersController);
  }
}
