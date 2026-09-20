import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { OrdersService } from '../orders.service';
import { PaginationArgs } from '../../common/graphql/pagination.args';

import { OrderType } from './types/order.type';
import { OrderItemType } from './types/order-item.type';
import { OrderPageType } from './types/order-page.type';

import { CreateOrderInput } from './inputs/create-order.input';

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => OrderPageType, {
    description: 'Получить страницу заказов',
  })
  async orders(@Args() pagination: PaginationArgs) {
    const result = await this.ordersService.findAllPage(
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

  @Query(() => OrderType, {
    description: 'Получить заказ по идентификатору',
  })
  async order(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => OrderType, {
    description: 'Создать новый заказ',
  })
  async createOrder(
    @Args('input')
    input: CreateOrderInput,
  ) {
    return this.ordersService.create(input);
  }

  @Mutation(() => OrderType, {
    description: 'Подтвердить новый заказ',
  })
  async confirmOrder(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.confirmOrder(id);
  }

  @Mutation(() => OrderType, {
    description: 'Начать приготовление заказа',
  })
  async startOrder(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.startOrder(id);
  }

  @Mutation(() => OrderType, {
    description: 'Отметить заказ готовым',
  })
  async markOrderReady(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.markOrderReady(id);
  }

  @Mutation(() => OrderType, {
    description: 'Завершить готовый заказ',
  })
  async completeOrder(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.completeOrder(id);
  }

  @Mutation(() => OrderType, {
    description: 'Отменить заказ',
  })
  async cancelOrder(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ) {
    return this.ordersService.cancelOrder(id);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить заказ',
  })
  async deleteOrder(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор заказа',
    })
    id: number,
  ): Promise<boolean> {
    await this.ordersService.remove(id);

    return true;
  }

  @ResolveField(() => [OrderItemType], {
    name: 'items',
    description: 'Получить позиции заказа',
  })
  async items(@Parent() order: OrderType) {
    const items = await this.ordersService.findItemsByOrder(order.id);

    return items.map((item) => ({
      ...item,
      price: Number(item.price),
      dessert: item.dessert
        ? { ...item.dessert, price: Number(item.dessert.price) }
        : item.dessert,
    }));
  }
}
