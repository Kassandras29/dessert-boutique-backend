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
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
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
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { SessionRequest } from 'supertokens-node/framework/express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReviewOwnerOrAdminGuard } from './review-owner-or-admin.guard';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPaginationLink } from '../common/utils/pagination.util';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsApiController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
    @Query()
    query: PaginationQueryDto,
    @Res({ passthrough: true })
    response: Response,
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
  @ApiSecurity('supertokens')
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  async create(
    @Body()
    createReviewDto: CreateReviewDto,
    @Req()
    request: SessionRequest,
  ) {
    if (await this.isAdmin(request)) {
      return this.reviewsService.create(createReviewDto);
    }

    return this.reviewsService.createForAuthUser(
      createReviewDto,
      this.getUserId(request),
    );
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
  @ApiSecurity('supertokens')
  @Patch(':id')
  @UseGuards(AuthGuard, ReviewOwnerOrAdminGuard)
  async update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateReviewDto: UpdateReviewDto,
    @Req()
    request: SessionRequest,
  ) {
    if (await this.isAdmin(request)) {
      return this.reviewsService.update(id, updateReviewDto);
    }

    return this.reviewsService.updateForAuthUser(
      id,
      updateReviewDto,
      this.getUserId(request),
    );
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
  @ApiSecurity('supertokens')
  @Delete(':id')
  @UseGuards(AuthGuard, ReviewOwnerOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    await this.reviewsService.remove(id);
  }
}
