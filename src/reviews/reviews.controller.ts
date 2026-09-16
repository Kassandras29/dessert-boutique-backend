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
  Sse,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Render('reviews')
  async findAll(@Query('auth') auth?: string) {
    const reviews = await this.reviewsService.findAll();

    return {
      title: 'Отзывы - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      reviews,
      isReviewsPage: true,
    };
  }

  @Get('add')
  @Render('review_add')
  async getAddPage(@Query('auth') auth?: string) {
    const customers = await this.reviewsService.findAllCustomers();
    const desserts = await this.reviewsService.findAllDesserts();

    return {
      title: 'Добавить отзыв - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      customers,
      desserts,
    };
  }

  @Post()
  @Redirect('/reviews', 303)
  async create(@Body() createReviewDto: CreateReviewDto) {
    await this.reviewsService.create(createReviewDto);
  }

  @Sse('events')
  events() {
    return this.reviewsService.streamEvents();
  }

  @Get(':id/edit')
  @Render('review_edit')
  async getEditPage(@Param('id') id: string, @Query('auth') auth?: string) {
    const review = await this.reviewsService.findOne(Number(id));
    const customers = await this.reviewsService.findAllCustomers();
    const desserts = await this.reviewsService.findAllDesserts();

    const customersWithSelected = customers.map((customer) => ({
      ...customer,
      selected: customer.id === review?.customerId,
    }));

    const dessertsWithSelected = desserts.map((dessert) => ({
      ...dessert,
      selected: dessert.id === review?.dessertId,
    }));

    return {
      title: 'Редактировать отзыв - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      review,
      customers: customersWithSelected,
      desserts: dessertsWithSelected,
    };
  }

  @Patch(':id')
  @Redirect('/reviews', 303)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    await this.reviewsService.update(Number(id), updateReviewDto);
  }

  @Delete(':id')
  @Redirect('/reviews', 303)
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(Number(id));
  }

  @Get(':id')
  @Render('review_details')
  async findOne(@Param('id') id: string, @Query('auth') auth?: string) {
    const review = await this.reviewsService.findOne(Number(id));

    return {
      title: 'Отзыв - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      review,
    };
  }
}
