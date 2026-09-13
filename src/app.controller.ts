import { Controller, Get, Query, Render } from '@nestjs/common';
import { CatalogService } from './catalog/catalog.service';
import { ReviewsService } from './reviews/reviews.service';

@Controller()
export class AppController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @Render('index')
  async getIndexPage(@Query('auth') auth?: string) {
    const products = await this.catalogService.findAllDesserts();
    const reviews = await this.reviewsService.findAll();

    return {
      title: 'Dessert boutique',
      description:
        'Кондитерская Dessert boutique - вкуснейшие десерты ручной работы из натуральных ингредиентов',
      user: auth === '1' ? { name: 'Irina' } : null,
      products,
      reviews,
    };
  }

  @Get('about')
  @Render('about')
  getAboutPage(@Query('auth') auth?: string) {
    return {
      title: 'О нас - Dessert boutique',
      description: 'О кондитерской Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }

  @Get('history_desserts')
  @Render('history_desserts')
  getHistoryDessertsPage(@Query('auth') auth?: string) {
    return {
      title: 'Истории десертов - Dessert boutique',
      description: 'Истории знаменитых десертов',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }

  @Get('prices')
  @Render('prices')
  getPricesPage(@Query('auth') auth?: string) {
    return {
      title: 'Цены - Dessert boutique',
      description: 'Цены на десерты Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContactsPage(@Query('auth') auth?: string) {
    return {
      title: 'Контакты - Dessert boutique',
      description: 'Контакты Dessert boutique',
      user: auth === '1' ? { name: 'Irina' } : null,
    };
  }
}
