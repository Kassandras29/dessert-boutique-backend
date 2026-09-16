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

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPaginationLink } from '../common/utils/pagination.util';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsApiController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Получить список отзывов',
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
    description: 'Список отзывов',
    type: ReviewResponseDto,
    isArray: true,
    headers: {
      Link: {
        description: 'Ссылки на предыдущую и следующую страницы пагинации',
        schema: {
          type: 'string',
          example: '</api/reviews?page=2&limit=10>; rel="next"',
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
    const result = await this.reviewsService.findAllPage(
      query.page,
      query.limit,
    );

    const link = buildPaginationLink(
      '/api/reviews',
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
    summary: 'Получить отзыв по идентификатору',
  })
  @ApiOkResponse({
    description: 'Отзыв найден',
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
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать отзыв',
  })
  @ApiCreatedResponse({
    description: 'Отзыв создан',
    type: ReviewResponseDto,
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
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @ApiOperation({
    summary: 'Изменить отзыв',
  })
  @ApiOkResponse({
    description: 'Отзыв изменён',
    type: ReviewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Переданы некорректные данные',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Отзыв не найден',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Ошибка связанных данных',
    type: ErrorResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @ApiOperation({
    summary: 'Удалить отзыв',
  })
  @ApiNoContentResponse({
    description: 'Отзыв удалён',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный идентификатор',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Отзыв не найден',
    type: ErrorResponseDto,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reviewsService.remove(id);
  }
}
