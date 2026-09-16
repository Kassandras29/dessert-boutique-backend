import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllDesserts() {
    return this.prisma.dessert.findMany({
      include: {
        category: true,
      },
    });
  }

  async findDessertById(id: number) {
    const dessert = await this.prisma.dessert.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!dessert) {
      throw new NotFoundException('Десерт не найден');
    }

    return dessert;
  }

  async createDessert(createDessertDto: CreateDessertDto) {
    return this.prisma.dessert.create({
      data: {
        name: createDessertDto.name,
        description: createDessertDto.description,
        price: createDessertDto.price,
        categoryId: Number(createDessertDto.categoryId),
      },
      include: {
        category: true,
      },
    });
  }

  async updateDessert(id: number, updateDessertDto: UpdateDessertDto) {
    return this.prisma.dessert.update({
      where: {
        id,
      },
      data: {
        name: updateDessertDto.name,
        description: updateDessertDto.description,
        price: updateDessertDto.price,
        categoryId: Number(updateDessertDto.categoryId),
      },
      include: {
        category: true,
      },
    });
  }

  async deleteDessert(id: number) {
    const orderItemsCount = await this.prisma.orderItem.count({
      where: {
        dessertId: id,
      },
    });

    const reviewsCount = await this.prisma.review.count({
      where: {
        dessertId: id,
      },
    });

    if (orderItemsCount > 0 || reviewsCount > 0) {
      throw new BadRequestException(
        'Нельзя удалить десерт, который используется в заказах или отзывах',
      );
    }

    return this.prisma.dessert.delete({
      where: {
        id,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async findCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description || null,
      },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description || null,
      },
    });
  }

  async deleteCategory(id: number) {
    const dessertsCount = await this.prisma.dessert.count({
      where: {
        categoryId: id,
      },
    });

    if (dessertsCount > 0) {
      throw new BadRequestException(
        'Нельзя удалить категорию, в которой есть десерты',
      );
    }

    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  async findDessertsByCategory(categoryId: number) {
    return this.prisma.dessert.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async findDessertInCategory(categoryId: number, dessertId: number) {
    const dessert = await this.prisma.dessert.findFirst({
      where: {
        id: dessertId,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    if (!dessert) {
      throw new NotFoundException('Десерт категории не найден');
    }

    return dessert;
  }

  async findReviewsByDessert(dessertId: number) {
    return this.prisma.review.findMany({
      where: {
        dessertId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });
  }

  async findReviewForDessert(dessertId: number, reviewId: number) {
    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        dessertId,
      },
      include: {
        customer: true,
        dessert: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Отзыв на десерт не найден');
    }

    return review;
  }

  async findDessertsPage(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.dessert.findMany({
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.dessert.count(),
    ]);

    return {
      items,
      total,
    };
  }

  async findCategoriesPage(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),

      this.prisma.category.count(),
    ]);

    return {
      items,
      total,
    };
  }
}
