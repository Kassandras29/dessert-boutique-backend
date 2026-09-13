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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('users')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Render('users')
  async findAll(@Query('auth') auth?: string) {
    const customers = await this.customersService.findAll();

    return {
      title: 'Наши клиенты - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      customers,
    };
  }

  @Get('add')
  @Render('user_add')
  getAddPage(@Query('auth') auth?: string) {
    return {
      title: 'Добавить клиента - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }

  @Post()
  @Redirect('/users', 303)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    await this.customersService.create(createCustomerDto);
  }

  @Get(':id/edit')
  @Render('user_edit')
  async getEditPage(@Param('id') id: string, @Query('auth') auth?: string) {
    const customer = await this.customersService.findOne(Number(id));

    return {
      title: `Редактировать клиента - Dessert boutique`,
      user: auth === '1' ? { name: 'Irina' } : null,
      customer,
    };
  }

  @Patch(':id')
  @Redirect('/users', 303)
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customersService.update(Number(id), updateCustomerDto);
  }

  @Delete(':id')
  @Redirect('/users', 303)
  async remove(@Param('id') id: string) {
    await this.customersService.remove(Number(id));
  }

  @Get(':id')
  @Render('user_details')
  async findOne(@Param('id') id: string, @Query('auth') auth?: string) {
    const customer = await this.customersService.findOne(Number(id));

    return {
      title: `${customer?.name ?? 'Клиент'} - Dessert boutique`,
      user: auth === '1' ? { name: 'Irina' } : null,
      customer,
    };
  }
}
