import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateDessertDto } from './dto/create-dessert.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateDessertDto } from './dto/update-dessert.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @Render('products')
  async getProductsPage(@Query('auth') auth?: string) {
    const products = await this.catalogService.findAllDesserts();

    return {
      title: 'Каталог - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      products,
    };
  }

  @Get('add')
  @Render('product_add')
  async getAddDessertPage(@Query('auth') auth?: string) {
    const categories = await this.catalogService.findAllCategories();

    return {
      title: 'Добавить десерт - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
      categories,
    };
  }

  @Post()
  @Redirect('/products', 303)
  async createDessert(
    @Body()
    createDessertDto: CreateDessertDto,
  ) {
    await this.catalogService.createDessert(createDessertDto);
  }

  @Get('categories/add')
  @Render('category_add')
  getAddCategoryPage(@Query('auth') auth?: string) {
    return {
      title: 'Добавить категорию - Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }

  @Post('categories')
  @Redirect('/products/add', 303)
  async createCategory(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    await this.catalogService.createCategory(createCategoryDto);
  }

  @Patch('categories/:id')
  @Redirect('/products/add', 303)
  async updateCategory(
    @Param('id') id: string,
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.catalogService.updateCategory(Number(id), updateCategoryDto);
  }

  @Delete('categories/:id')
  @Redirect('/products/add', 303)
  async deleteCategory(@Param('id') id: string) {
    await this.catalogService.deleteCategory(Number(id));
  }

  @Get(':id/edit')
  @Render('product_edit')
  async getEditDessertPage(
    @Param('id') id: string,
    @Query('auth') auth?: string,
  ) {
    const dessert = await this.catalogService.findDessertById(Number(id));

    const categories = await this.catalogService.findAllCategories();

    const categoriesWithSelected = categories.map((category) => ({
      ...category,
      selected: category.id === dessert?.categoryId,
    }));

    return {
      title: `Редактировать ${dessert?.name ?? 'десерт'} - Dessert boutique`,
      user: auth === '1' ? { name: 'Irina' } : null,
      dessert,
      categories: categoriesWithSelected,
    };
  }

  @Patch(':id')
  @Redirect('/products', 303)
  async updateDessert(
    @Param('id') id: string,
    @Body()
    updateDessertDto: UpdateDessertDto,
  ) {
    await this.catalogService.updateDessert(Number(id), updateDessertDto);
  }

  @Delete(':id')
  @Redirect('/products', 303)
  async deleteDessert(@Param('id') id: string) {
    await this.catalogService.deleteDessert(Number(id));
  }

  @Get(':id')
  @Render('product_details')
  async getDessertPage(@Param('id') id: string, @Query('auth') auth?: string) {
    const dessert = await this.catalogService.findDessertById(Number(id));

    return {
      title: `${dessert?.name ?? 'Десерт'} - Dessert boutique`,
      user: auth === '1' ? { name: 'Irina' } : null,
      dessert,
    };
  }
}
