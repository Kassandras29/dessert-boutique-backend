import {
  BadRequestException,
  Injectable,
  MessageEvent,
  NotFoundException,
} from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly eventsSubject = new Subject<MessageEvent>();

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        customer: true,
        dessert: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllPage(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
        include: {
          customer: true,
          dessert: true,
        },
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.review.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    return review;
  }

  async findAllCustomers() {
    return this.prisma.customer.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllDesserts() {
    return this.prisma.dessert.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async create(createReviewDto: CreateReviewDto) {
    this.validateRating(createReviewDto.rating);

    const review = await this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
        text: createReviewDto.text,
        customerId: createReviewDto.customerId,
        dessertId: createReviewDto.dessertId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    this.eventsSubject.next({
      data: {
        message: `Добавлен новый отзыв #${review.id}`,
      },
    });

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    this.validateRating(updateReviewDto.rating);

    const review = await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        rating: updateReviewDto.rating,
        text: updateReviewDto.text,
        customerId: updateReviewDto.customerId,
        dessertId: updateReviewDto.dessertId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    this.eventsSubject.next({
      data: {
        message: `Отзыв #${review.id} обновлён`,
      },
    });

    return review;
  }

  async remove(id: number) {
    const review = await this.prisma.review.delete({
      where: {
        id,
      },
    });

    this.eventsSubject.next({
      data: {
        message: `Отзыв #${review.id} удалён`,
      },
    });

    return review;
  }

  streamEvents(): Observable<MessageEvent> {
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
