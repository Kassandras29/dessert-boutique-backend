import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersApiController } from './customers-api.controller';
import { CustomersResolver } from './graphql/customers.resolver';

@Module({
  controllers: [CustomersController, CustomersApiController],
  providers: [CustomersService, CustomersResolver],
  exports: [CustomersService],
})
export class CustomersModule {}
