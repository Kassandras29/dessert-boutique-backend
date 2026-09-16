import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Render('orders')
  async findAll(@Query('auth') auth?: string) {
    const orders = await this.ordersService.findAll();

    return {
      title: 'Заказы - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      orders,
    };
  }

  @Get('add')
  @Render('order_add')
  async getAddPage(@Query('auth') auth?: string) {
    const customers = await this.ordersService.findAllCustomers();
    const desserts = await this.ordersService.findAllDesserts();

    return {
      title: 'Создать заказ - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      customers,
      desserts,
    };
  }

  @Post()
  @Redirect('/orders', 303)
  async create(@Body() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto);
  }

  @Get(':id/edit')
  @Render('order_edit')
  async getEditPage(@Param('id') id: string, @Query('auth') auth?: string) {
    const order = await this.ordersService.findOne(Number(id));
    const customers = await this.ordersService.findAllCustomers();

    const customersWithSelected = customers.map((customer) => ({
      ...customer,
      selected: customer.id === order?.customerId,
    }));

    const statuses = Object.values(OrderStatus).map((status) => ({
      value: status,
      selected: status === order?.status,
    }));

    return {
      title: 'Редактировать заказ - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      order,
      customers: customersWithSelected,
      statuses,
    };
  }

  @Patch(':id')
  @Redirect('/orders', 303)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    await this.ordersService.update(Number(id), updateOrderDto);
  }

  @Delete(':id')
  @Redirect('/orders', 303)
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(Number(id));
  }

  @Get(':id')
  @Render('order_details')
  async findOne(@Param('id') id: string, @Query('auth') auth?: string) {
    const order = await this.ordersService.findOne(Number(id));

    return {
      title: `Заказ №${order?.id ?? ''} - Dessert boutique`,
      user: auth === '1' ? { name: 'Irina' } : null,
      order,
    };
  }
}
