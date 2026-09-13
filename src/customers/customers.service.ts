import { BadRequestException, Injectable } from '@nestjs/common';
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
    return this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        orders: true,
        reviews: true,
      },
    });
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
}
