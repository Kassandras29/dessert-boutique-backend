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
  Sse,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { SessionRequest } from 'supertokens-node/framework/express';
import UserRoles from 'supertokens-node/recipe/userroles';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewOwnerOrAdminGuard } from './review-owner-or-admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiExcludeController()
@Controller('reviews')
export class ReviewsController {
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

  @Get()
  @Render('reviews')
  async findAll() {
    const reviews = await this.reviewsService.findAll();

    return {
      title: 'Отзывы - Dessert boutique',
      reviews,
      isReviewsPage: true,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Render('review_add')
  async getAddPage(
    @Req()
    request: SessionRequest,
  ) {
    const isAdmin = await this.isAdmin(request);

    const customers = isAdmin
      ? await this.reviewsService.findAllCustomers()
      : [
          await this.reviewsService.findCustomerForAuthUser(
            this.getUserId(request),
          ),
        ];

    const desserts = await this.reviewsService.findAllDesserts();

    return {
      title: 'Добавить отзыв - Dessert boutique',
      customers,
      desserts,
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Redirect('/reviews', 303)
  async create(
    @Body()
    createReviewDto: CreateReviewDto,
    @Req()
    request: SessionRequest,
  ) {
    if (await this.isAdmin(request)) {
      await this.reviewsService.create(createReviewDto);

      return;
    }

    await this.reviewsService.createForAuthUser(
      createReviewDto,
      this.getUserId(request),
    );
  }

  @Sse('events')
  events() {
    return this.reviewsService.streamEvents();
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, ReviewOwnerOrAdminGuard)
  @Render('review_edit')
  async getEditPage(
    @Param('id') id: string,
    @Req()
    request: SessionRequest,
  ) {
    const review = await this.reviewsService.findOne(Number(id));

    const isAdmin = await this.isAdmin(request);

    const customers = isAdmin
      ? await this.reviewsService.findAllCustomers()
      : [
          await this.reviewsService.findCustomerForAuthUser(
            this.getUserId(request),
          ),
        ];

    const desserts = await this.reviewsService.findAllDesserts();

    const customersWithSelected = customers.map((customer) => ({
      ...customer,
      selected: customer.id === review.customerId,
    }));

    const dessertsWithSelected = desserts.map((dessert) => ({
      ...dessert,
      selected: dessert.id === review.dessertId,
    }));

    return {
      title: 'Редактировать отзыв - Dessert boutique',
      review,
      customers: customersWithSelected,
      desserts: dessertsWithSelected,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, ReviewOwnerOrAdminGuard)
  @Redirect('/reviews', 303)
  async update(
    @Param('id') id: string,
    @Body()
    updateReviewDto: UpdateReviewDto,
    @Req()
    request: SessionRequest,
  ) {
    if (await this.isAdmin(request)) {
      await this.reviewsService.update(Number(id), updateReviewDto);

      return;
    }

    await this.reviewsService.updateForAuthUser(
      Number(id),
      updateReviewDto,
      this.getUserId(request),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, ReviewOwnerOrAdminGuard)
  @Redirect('/reviews', 303)
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(Number(id));
  }

  @Get(':id')
  @Render('review_details')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(Number(id));

    return {
      title: 'Отзыв - Dessert boutique',
      review,
    };
  }
}
