import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
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

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: {
        id,
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

  async findAllCustomers() {
    return this.prisma.customer.findMany();
  }

  async findAllDesserts() {
    return this.prisma.dessert.findMany({
      include: {
        category: true,
      },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const dessert = await this.prisma.dessert.findUnique({
      where: {
        id: Number(createOrderDto.dessertId),
      },
    });

    if (!dessert) {
      throw new NotFoundException('Десерт не найден');
    }

    const quantity = Number(createOrderDto.quantity);

    if (quantity < 1) {
      throw new BadRequestException('Количество должно быть больше нуля');
    }

    return this.prisma.order.create({
      data: {
        customerId: Number(createOrderDto.customerId),

        items: {
          create: {
            dessertId: dessert.id,
            quantity,
            price: dessert.price,
          },
        },
      },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        customerId: Number(updateOrderDto.customerId),
        status: updateOrderDto.status,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
