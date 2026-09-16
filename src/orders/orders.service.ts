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
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findAllPage(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          customer: true,
          items: {
            include: {
              dessert: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.order.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
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

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return order;
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

  async create(createOrderDto: CreateOrderDto) {
    const dessertIds = createOrderDto.items.map((item) => item.dessertId);

    const uniqueDessertIds = new Set(dessertIds);

    if (uniqueDessertIds.size !== dessertIds.length) {
      throw new BadRequestException(
        'Один десерт нельзя добавлять в заказ несколько раз',
      );
    }

    const desserts = await this.prisma.dessert.findMany({
      where: {
        id: {
          in: dessertIds,
        },
      },
    });

    if (desserts.length !== dessertIds.length) {
      throw new BadRequestException('Один или несколько десертов не найдены');
    }

    const items = createOrderDto.items.map((item) => {
      const dessert = desserts.find((dessert) => dessert.id === item.dessertId);

      if (!dessert) {
        throw new BadRequestException('Десерт не найден');
      }

      return {
        dessertId: item.dessertId,
        quantity: item.quantity,
        price: dessert.price,
      };
    });

    return this.prisma.order.create({
      data: {
        customerId: createOrderDto.customerId,
        items: {
          create: items,
        },
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        customerId: updateOrderDto.customerId,
        status: updateOrderDto.status,
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

  async remove(id: number) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }

  async findItemsByOrder(orderId: number) {
    return this.prisma.orderItem.findMany({
      where: {
        orderId,
      },
      include: {
        dessert: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findItemForOrder(orderId: number, itemId: number) {
    const item = await this.prisma.orderItem.findFirst({
      where: {
        id: itemId,
        orderId,
      },
      include: {
        dessert: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Позиция заказа не найдена');
    }

    return item;
  }
}
