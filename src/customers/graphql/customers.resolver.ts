import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { CustomersService } from '../customers.service';
import { PaginationArgs } from '../../common/graphql/pagination.args';

import { CustomerType } from './types/customer.type';
import { CustomerPageType } from './types/customer-page.type';

import { CreateCustomerInput } from './inputs/create-customer.input';
import { UpdateCustomerInput } from './inputs/update-customer.input';

import { OrderType } from '../../orders/graphql/types/order.type';
import { ReviewType } from '../../reviews/graphql/types/review.type';

@Resolver(() => CustomerType)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => CustomerPageType, {
    description: 'Получить страницу клиентов',
  })
  async customers(@Args() pagination: PaginationArgs) {
    const result = await this.customersService.findAllPage(
      pagination.page,
      pagination.limit,
    );

    return {
      items: result.items,
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(result.total / pagination.limit),
    };
  }

  @Query(() => CustomerType, {
    description: 'Получить клиента по идентификатору',
  })
  async customer(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор клиента',
    })
    id: number,
  ) {
    return this.customersService.findOne(id);
  }

  @Mutation(() => CustomerType, {
    description: 'Создать нового клиента',
  })
  async createCustomer(
    @Args('input')
    input: CreateCustomerInput,
  ) {
    return this.customersService.create(input);
  }

  @Mutation(() => CustomerType, {
    description: 'Изменить данные клиента',
  })
  async updateCustomer(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор клиента',
    })
    id: number,

    @Args('input')
    input: UpdateCustomerInput,
  ) {
    return this.customersService.update(id, input);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить клиента',
  })
  async deleteCustomer(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор клиента',
    })
    id: number,
  ): Promise<boolean> {
    await this.customersService.remove(id);

    return true;
  }

  @ResolveField(() => [OrderType], {
    name: 'orders',
    description: 'Получить заказы клиента',
  })
  async orders(@Parent() customer: CustomerType) {
    return this.customersService.findOrdersByCustomer(customer.id);
  }

  @ResolveField(() => [ReviewType], {
    name: 'reviews',
    description: 'Получить отзывы клиента',
  })
  async reviews(@Parent() customer: CustomerType) {
    return this.customersService.findReviewsByCustomer(customer.id);
  }
}
