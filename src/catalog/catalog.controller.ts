import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiExcludeController()
@Controller('products')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  @Get()
  @Render('products')
  async getProductsPage() {
    const products = await this.catalogService.findAllDesserts();

    return {
      title: 'Каталог - Dessert boutique',
      products,
    };
  }

  @Get('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('product_add')
  async getAddDessertPage() {
    const categories = await this.catalogService.findAllCategories();

    return {
      title: 'Добавить десерт - Dessert boutique',
      categories,
    };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products', 303)
  @UseInterceptors(FileInterceptor('image'))
  async createDessert(
    @Body()
    createDessertDto: CreateDessertDto,
    @UploadedFile()
    file?: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
    },
  ) {
    const imageUrl = file
      ? await this.objectStorageService.uploadFile(file)
      : undefined;

    await this.catalogService.createDessert(createDessertDto, imageUrl);
  }

  @Get('categories/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('category_add')
  getAddCategoryPage() {
    return {
      title: 'Добавить категорию - Dessert boutique',
    };
  }

  @Post('categories')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products/add', 303)
  async createCategory(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    await this.catalogService.createCategory(createCategoryDto);
  }

  @Patch('categories/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products/add', 303)
  async updateCategory(
    @Param('id') id: string,
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.catalogService.updateCategory(Number(id), updateCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products/add', 303)
  async deleteCategory(@Param('id') id: string) {
    await this.catalogService.deleteCategory(Number(id));
  }

  @Get(':id/edit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Render('product_edit')
  async getEditDessertPage(@Param('id') id: string) {
    const dessert = await this.catalogService.findDessertById(Number(id));

    const categories = await this.catalogService.findAllCategories();

    const categoriesWithSelected = categories.map((category) => ({
      ...category,
      selected: category.id === dessert?.categoryId,
    }));

    return {
      title: `Редактировать ${dessert?.name ?? 'десерт'} - Dessert boutique`,
      dessert,
      categories: categoriesWithSelected,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products', 303)
  async updateDessert(
    @Param('id') id: string,
    @Body()
    updateDessertDto: UpdateDessertDto,
  ) {
    await this.catalogService.updateDessert(Number(id), updateDessertDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Redirect('/products', 303)
  async deleteDessert(@Param('id') id: string) {
    await this.catalogService.deleteDessert(Number(id));
  }

  @Get(':id')
  @Render('product_details')
  async getDessertPage(@Param('id') id: string) {
    const dessert = await this.catalogService.findDessertById(Number(id));

    return {
      title: `${dessert?.name ?? 'Десерт'} - Dessert boutique`,
      dessert,
    };
  }
}
