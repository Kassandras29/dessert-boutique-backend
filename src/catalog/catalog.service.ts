import { BadRequestException, Injectable } from '@nestjs/common';
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
    return this.prisma.dessert.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async createDessert(createDessertDto: CreateDessertDto) {
    return this.prisma.dessert.create({
      data: {
        name: createDessertDto.name,
        description: createDessertDto.description,
        price: createDessertDto.price,
        categoryId: Number(createDessertDto.categoryId),
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
}
