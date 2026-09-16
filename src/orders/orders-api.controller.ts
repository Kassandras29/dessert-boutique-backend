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

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderItemResponseDto } from './dto/order-item-response.dto';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPaginationLink } from '../common/utils/pagination.util';

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersApiController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Получить список заказов',
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
    description: 'Список заказов',
    type: OrderResponseDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Ссылки на предыдущую и следующую страницы пагинации',
        schema: {
          type: 'string',
          example: '</api/orders?page=2&limit=10>; rel="next"',
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
    const result = await this.ordersService.findAllPage(
      query.page,
      query.limit,
    );

    const link = buildPaginationLink(
      '/api/orders',
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
    summary: 'Получить позиции заказа',
  })
  @ApiOkResponse({
    description: 'Список позиций заказа',
    type: OrderItemResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор заказа',
    type: ErrorResponseDto,
  })
  @Get(':id/items')
  findOrderItems(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findItemsByOrder(id);
  }

  @ApiOperation({
    summary: 'Получить конкретную позицию заказа',
  })
  @ApiOkResponse({
    description: 'Позиция заказа получена',
    type: OrderItemResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Позиция заказа не найдена',
    type: ErrorResponseDto,
  })
  @Get(':id/items/:itemId')
  findOrderItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.ordersService.findItemForOrder(id, itemId);
  }

  @ApiOperation({
    summary: 'Получить заказ по идентификатору',
  })
  @ApiOkResponse({
    description: 'Заказ найден',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Заказ не найден',
    type: ErrorResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать заказ',
  })
  @ApiCreatedResponse({
    description: 'Заказ создан',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ошибка связанных данных',
    type: ErrorResponseDto,
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({
    summary: 'Изменить заказ',
  })
  @ApiOkResponse({
    description: 'Заказ изменён',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Заказ не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ошибка связанных данных',
    type: ErrorResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({
    summary: 'Удалить заказ',
  })
  @ApiNoContentResponse({
    description: 'Заказ удалён',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Заказ не найден',
    type: ErrorResponseDto,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.remove(id);
  }
}
