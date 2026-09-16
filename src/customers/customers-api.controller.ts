import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';

import { OrderResponseDto } from '../orders/dto/order-response.dto';
import { ReviewResponseDto } from '../reviews/dto/review-response.dto';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPaginationLink } from '../common/utils/pagination.util';

@ApiTags('Customers')
@Controller('api/customers')
export class CustomersApiController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({
    summary: 'Получить список клиентов',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Количество элементов на странице',
  })
  @ApiOkResponse({
    description: 'Список клиентов',
    type: CustomerResponseDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Ссылки на предыдущую и следующую страницы пагинации',
        schema: {
          type: 'string',
          example: '</api/customers?page=2&limit=10>; rel="next"',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные параметры пагинации',
    type: ErrorResponseDto,
  })
  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.customersService.findAllPage(
      query.page,
      query.limit,
    );

    const link = buildPaginationLink(
      '/api/customers',
      query.page,
      query.limit,
      result.total,
    );

    if (link) {
      response.setHeader('Link', link);
    }

    return result.items;
  }

  @ApiOperation({
    summary: 'Получить заказы клиента',
  })
  @ApiOkResponse({
    description: 'Список заказов клиента',
    type: OrderResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор клиента',
    type: ErrorResponseDto,
  })
  @Get(':id/orders')
  findCustomerOrders(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOrdersByCustomer(id);
  }

  @ApiOperation({
    summary: 'Получить конкретный заказ клиента',
  })
  @ApiOkResponse({
    description: 'Заказ клиента получен',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Заказ клиента не найден',
    type: ErrorResponseDto,
  })
  @Get(':id/orders/:orderId')
  findCustomerOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.customersService.findOrderForCustomer(id, orderId);
  }

  @ApiOperation({
    summary: 'Получить отзывы клиента',
  })
  @ApiOkResponse({
    description: 'Список отзывов клиента',
    type: ReviewResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор клиента',
    type: ErrorResponseDto,
  })
  @Get(':id/reviews')
  findCustomerReviews(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findReviewsByCustomer(id);
  }

  @ApiOperation({
    summary: 'Получить конкретный отзыв клиента',
  })
  @ApiOkResponse({
    description: 'Отзыв клиента получен',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Отзыв клиента не найден',
    type: ErrorResponseDto,
  })
  @Get(':id/reviews/:reviewId')
  findCustomerReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return this.customersService.findReviewForCustomer(id, reviewId);
  }

  @ApiOperation({
    summary: 'Получить клиента по идентификатору',
  })
  @ApiOkResponse({
    description: 'Клиент найден',
    type: CustomerResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Клиент не найден',
    type: ErrorResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать клиента',
  })
  @ApiCreatedResponse({
    description: 'Клиент создан',
    type: CustomerResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Клиент с таким email уже существует',
    type: ErrorResponseDto,
  })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({
    summary: 'Изменить клиента',
  })
  @ApiOkResponse({
    description: 'Клиент изменён',
    type: CustomerResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Клиент не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Клиент с таким email уже существует',
    type: ErrorResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({
    summary: 'Удалить клиента',
  })
  @ApiNoContentResponse({
    description: 'Клиент удалён',
  })
  @ApiBadRequestResponse({
    description: 'Нельзя удалить клиента, у которого есть заказы или отзывы',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Клиент не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Конфликт связанных данных',
    type: ErrorResponseDto,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.customersService.remove(id);
  }
}
