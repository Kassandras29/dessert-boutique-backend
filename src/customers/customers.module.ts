import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersApiController } from './customers-api.controller';

@Module({
  controllers: [CustomersController, CustomersApiController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
