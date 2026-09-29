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
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CustomerOwnerOrAdminGuard } from './customer-owner-or-admin.guard';

@ApiExcludeController()
@Controller('users')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('users')
  async findAll() {
    const customers = await this.customersService.findAll();

    return {
      title: 'Наши клиенты - Dessert boutique',
      customers,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('user_add')
  getAddPage() {
    return {
      title: 'Добавить клиента - Dessert boutique',
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/users', 303)
  async create(
    @Body()
    createCustomerDto: CreateCustomerDto,
  ) {
    await this.customersService.create(createCustomerDto);
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, CustomerOwnerOrAdminGuard)
  @Render('user_edit')
  async getEditPage(@Param('id') id: string) {
    const customer = await this.customersService.findOne(Number(id));

    return {
      title: 'Редактировать клиента - Dessert boutique',
      customer,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, CustomerOwnerOrAdminGuard)
  @Redirect('/users', 303)
  async update(
    @Param('id') id: string,
    @Body()
    updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customersService.update(Number(id), updateCustomerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, CustomerOwnerOrAdminGuard)
  @Redirect('/users', 303)
  async remove(@Param('id') id: string) {
    await this.customersService.remove(Number(id));
  }

  @Get(':id')
  @UseGuards(AuthGuard, CustomerOwnerOrAdminGuard)
  @Render('user_details')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(Number(id));

    return {
      title: `${customer?.name ?? 'Клиент'} - Dessert boutique`,
      customer,
    };
  }
}
