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

import { CatalogService } from './catalog.service';

import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { DessertResponseDto } from './dto/dessert-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ReviewResponseDto } from '../reviews/dto/review-response.dto';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPaginationLink } from '../common/utils/pagination.util';

@ApiTags('Catalog')
@Controller('api')
export class CatalogApiController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({
    summary: 'Получить список десертов',
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
    description: 'Список десертов',
    type: DessertResponseDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Ссылки на предыдущую и следующую страницы пагинации',
        schema: {
          type: 'string',
          example: '</api/products?page=2&limit=10>; rel="next"',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные параметры пагинации',
    type: ErrorResponseDto,
  })
  @Get('products')
  async findAllProducts(
    @Query() query: PaginationQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.catalogService.findDessertsPage(
      query.page,
      query.limit,
    );

    const link = buildPaginationLink(
      '/api/products',
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
    summary: 'Получить отзывы на десерт',
  })
  @ApiOkResponse({
    description: 'Отзывы на десерт',
    type: ReviewResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @Get('products/:id/reviews')
  findProductReviews(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findReviewsByDessert(id);
  }

  @ApiOperation({
    summary: 'Получить конкретный отзыв на десерт',
  })
  @ApiOkResponse({
    description: 'Отзыв получен',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Отзыв не найден',
    type: ErrorResponseDto,
  })
  @Get('products/:id/reviews/:reviewId')
  findProductReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return this.catalogService.findReviewForDessert(id, reviewId);
  }

  @ApiOperation({
    summary: 'Получить десерт по идентификатору',
  })
  @ApiOkResponse({
    description: 'Десерт найден',
    type: DessertResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Десерт не найден',
    type: ErrorResponseDto,
  })
  @Get('products/:id')
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findDessertById(id);
  }

  @ApiOperation({
    summary: 'Создать десерт',
  })
  @ApiCreatedResponse({
    description: 'Десерт создан',
    type: DessertResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ошибка связанных данных',
    type: ErrorResponseDto,
  })
  @Post('products')
  createProduct(@Body() createDessertDto: CreateDessertDto) {
    return this.catalogService.createDessert(createDessertDto);
  }

  @ApiOperation({
    summary: 'Изменить десерт',
  })
  @ApiOkResponse({
    description: 'Десерт изменён',
    type: DessertResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Десерт не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ошибка связанных данных',
    type: ErrorResponseDto,
  })
  @Patch('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDessertDto: UpdateDessertDto,
  ) {
    return this.catalogService.updateDessert(id, updateDessertDto);
  }

  @ApiOperation({
    summary: 'Удалить десерт',
  })
  @ApiNoContentResponse({
    description: 'Десерт удалён',
  })
  @ApiBadRequestResponse({
    description: 'Нельзя удалить десерт, связанный с заказами или отзывами',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Десерт не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Конфликт связанных данных',
    type: ErrorResponseDto,
  })
  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.catalogService.deleteDessert(id);
  }

  @ApiOperation({
    summary: 'Получить список категорий',
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
    description: 'Список категорий',
    type: CategoryResponseDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Ссылки на предыдущую и следующую страницы пагинации',
        schema: {
          type: 'string',
          example: '</api/categories?page=2&limit=10>; rel="next"',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные параметры пагинации',
    type: ErrorResponseDto,
  })
  @Get('categories')
  async findAllCategories(
    @Query() query: PaginationQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.catalogService.findCategoriesPage(
      query.page,
      query.limit,
    );

    const link = buildPaginationLink(
      '/api/categories',
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
    summary: 'Получить десерты категории',
  })
  @ApiOkResponse({
    description: 'Десерты категории',
    type: DessertResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор категории',
    type: ErrorResponseDto,
  })
  @Get('categories/:id/products')
  findCategoryProducts(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findDessertsByCategory(id);
  }

  @ApiOperation({
    summary: 'Получить конкретный десерт категории',
  })
  @ApiOkResponse({
    description: 'Десерт категории получен',
    type: DessertResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Десерт категории не найден',
    type: ErrorResponseDto,
  })
  @Get('categories/:id/products/:productId')
  findCategoryProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.catalogService.findDessertInCategory(id, productId);
  }

  @ApiOperation({
    summary: 'Получить категорию по идентификатору',
  })
  @ApiOkResponse({
    description: 'Категория найдена',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория не найдена',
    type: ErrorResponseDto,
  })
  @Get('categories/:id')
  findCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.findCategoryById(id);
  }

  @ApiOperation({
    summary: 'Создать категорию',
  })
  @ApiCreatedResponse({
    description: 'Категория создана',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Категория с таким названием уже существует',
    type: ErrorResponseDto,
  })
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.catalogService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Изменить категорию',
  })
  @ApiOkResponse({
    description: 'Категория изменена',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория не найдена',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Категория с таким названием уже существует',
    type: ErrorResponseDto,
  })
  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.catalogService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Удалить категорию',
  })
  @ApiNoContentResponse({
    description: 'Категория удалена',
  })
  @ApiBadRequestResponse({
    description: 'Нельзя удалить категорию, в которой есть десерты',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Категория не найдена',
    type: ErrorResponseDto,
  })
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.catalogService.deleteCategory(id);
  }
}
