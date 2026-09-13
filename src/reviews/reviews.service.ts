import { BadRequestException, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly eventsSubject = new Subject<{
    data: {
      type: string;
      reviewId: number;
      message: string;
    };
  }>();

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        customer: true,
        dessert: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.review.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });
  }

  async findAllCustomers() {
    return this.prisma.customer.findMany();
  }

  async findAllDesserts() {
    return this.prisma.dessert.findMany();
  }

  async create(createReviewDto: CreateReviewDto) {
    const rating = Number(createReviewDto.rating);

    this.validateRating(rating);

    const review = await this.prisma.review.create({
      data: {
        rating,
        text: createReviewDto.text,
        customerId: Number(createReviewDto.customerId),
        dessertId: Number(createReviewDto.dessertId),
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    this.eventsSubject.next({
      data: {
        type: 'created',
        reviewId: review.id,
        message: `Добавлен новый отзыв на десерт «${review.dessert.name}»`,
      },
    });

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const rating = Number(updateReviewDto.rating);

    this.validateRating(rating);

    const review = await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        rating,
        text: updateReviewDto.text,
        customerId: Number(updateReviewDto.customerId),
        dessertId: Number(updateReviewDto.dessertId),
      },
      include: {
        dessert: true,
      },
    });

    this.eventsSubject.next({
      data: {
        type: 'updated',
        reviewId: review.id,
        message: `Изменён отзыв на десерт «${review.dessert.name}»`,
      },
    });

    return review;
  }

  async remove(id: number) {
    const review = await this.prisma.review.delete({
      where: {
        id,
      },
      include: {
        dessert: true,
      },
    });

    this.eventsSubject.next({
      data: {
        type: 'deleted',
        reviewId: review.id,
        message: `Удалён отзыв на десерт «${review.dessert.name}»`,
      },
    });

    return review;
  }

  streamEvents() {
    return this.eventsSubject.asObservable();
  }

  private validateRating(rating: number) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException(
        'Оценка должна быть целым числом от 1 до 5',
      );
    }
  }
}
