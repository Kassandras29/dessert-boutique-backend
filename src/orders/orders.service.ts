import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
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

  async findAllForAuthUser(authUserId: string) {
    return this.prisma.order.findMany({
      where: {
        customer: {
          is: {
            authUserId,
          },
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
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findCustomerForAuthUser(authUserId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        authUserId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Клиент для текущего пользователя не найден');
    }

    return customer;
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

  async findAllPageForAuthUser(
    authUserId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      customer: {
        is: {
          authUserId,
        },
      },
    };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
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

      this.prisma.order.count({ where }),
    ]);

    return { items, total };
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

  async createForAuthUser(createOrderDto: CreateOrderDto, authUserId: string) {
    const customer = await this.findCustomerForAuthUser(authUserId);

    return this.create({
      ...createOrderDto,
      customerId: customer.id,
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

  async confirmOrder(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.NEW) {
      throw new BadRequestException('Подтвердить можно только новый заказ');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CONFIRMED,
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

  async startOrder(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException(
        'Начать приготовление можно только для подтвержденного заказа',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.IN_PROGRESS,
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

  async markOrderReady(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Готовым можно отметить только заказ в процессе приготовления',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.READY,
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

  async completeOrder(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Завершить можно только готовый заказ');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.COMPLETED,
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

  async cancelOrder(id: number) {
    const order = await this.findOne(id);

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Завершенный или уже отмененный заказ отменить нельзя',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
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
}
