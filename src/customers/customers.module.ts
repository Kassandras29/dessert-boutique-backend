import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersApiController } from './customers-api.controller';
import { CustomersResolver } from './graphql/customers.resolver';
import { AuthRedirectMiddleware } from '../auth/auth-redirect.middleware';

@Module({
  controllers: [CustomersController, CustomersApiController],
  providers: [CustomersService, CustomersResolver],
  exports: [CustomersService],
})
export class CustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthRedirectMiddleware).forRoutes(CustomersController);
  }
}
