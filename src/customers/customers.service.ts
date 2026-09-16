import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany();
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
        reviews: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Клиент не найден');
    }

    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone || null,
      },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        name: updateCustomerDto.name,
        email: updateCustomerDto.email,
        phone: updateCustomerDto.phone || null,
      },
    });
  }

  async remove(id: number) {
    const ordersCount = await this.prisma.order.count({
      where: {
        customerId: id,
      },
    });

    const reviewsCount = await this.prisma.review.count({
      where: {
        customerId: id,
      },
    });

    if (ordersCount > 0 || reviewsCount > 0) {
      throw new BadRequestException(
        'Нельзя удалить клиента, у которого есть заказы или отзывы',
      );
    }

    return this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }

  async findOrdersByCustomer(customerId: number) {
    return this.prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        customer: true,
        items: {
          include: {
            dessert: true,
          },
        },
      },
    });
  }

  async findOrderForCustomer(customerId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        customer: true,
        items: {
          include: {
            dessert: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ клиента не найден');
    }

    return order;
  }

  async findReviewsByCustomer(customerId: number) {
    return this.prisma.review.findMany({
      where: {
        customerId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });
  }

  async findReviewForCustomer(customerId: number, reviewId: number) {
    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        customerId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Отзыв клиента не найден');
    }

    return review;
  }

  async findAllPage(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.customer.count(),
    ]);

    return {
      items,
      total,
    };
  }
}
