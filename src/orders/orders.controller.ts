import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ApiExcludeController } from '@nestjs/swagger';
import type { SessionRequest } from 'supertokens-node/framework/express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { OrderOwnerOrAdminGuard } from './order-owner-or-admin.guard';

@ApiExcludeController()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getUserId(request: SessionRequest): string {
    if (!request.session) {
      throw new UnauthorizedException('Authentication required');
    }

    return request.session.getUserId();
  }

  private async isAdmin(request: SessionRequest): Promise<boolean> {
    if (!request.session) {
      return false;
    }

    const roles = await request.session.getClaimValue(UserRoles.UserRoleClaim);

    return roles?.includes('ADMIN') ?? false;
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Render('orders')
  async findAll(@Req() request: SessionRequest) {
    const orders = (await this.isAdmin(request))
      ? this.ordersService.findAll()
      : this.ordersService.findAllForAuthUser(this.getUserId(request));

    return {
      title: 'Заказы - Dessert boutique',
      orders,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Render('order_add')
  async getAddPage(@Req() request: SessionRequest) {
    const isAdmin = await this.isAdmin(request);

    const customers = isAdmin
      ? await this.ordersService.findAllCustomers()
      : [
          await this.ordersService.findCustomerForAuthUser(
            this.getUserId(request),
          ),
        ];

    const desserts = await this.ordersService.findAllDesserts();

    return {
      title: 'Создать заказ - Dessert boutique',
      customers,
      desserts,
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Redirect('/orders', 303)
  async create(
    @Body()
    createOrderDto: CreateOrderDto,
    @Req() request: SessionRequest,
  ) {
    if (await this.isAdmin(request)) {
      await this.ordersService.create(createOrderDto);

      return;
    }

    await this.ordersService.createForAuthUser(
      createOrderDto,
      this.getUserId(request),
    );
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('order_edit')
  async getEditPage(@Param('id') id: string) {
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
      order,
      customers: customersWithSelected,
      statuses,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/orders', 303)
  async update(
    @Param('id') id: string,
    @Body()
    updateOrderDto: UpdateOrderDto,
  ) {
    await this.ordersService.update(Number(id), updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, OrderOwnerOrAdminGuard)
  @Redirect('/orders', 303)
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(Number(id));
  }

  @Get(':id')
  @UseGuards(AuthGuard, OrderOwnerOrAdminGuard)
  @Render('order_details')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(Number(id));

    return {
      title: `Заказ №${order?.id ?? ''} - Dessert boutique`,
      order,
    };
  }
}
