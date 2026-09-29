import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CatalogService } from './catalog/catalog.service';
import { ReviewsService } from './reviews/reviews.service';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @Render('index')
  async getIndexPage() {
    const products = await this.catalogService.findAllDesserts();
    const reviews = await this.reviewsService.findAll();

    return {
      title: 'Dessert boutique',
      description:
        'Кондитерская Dessert boutique - вкуснейшие десерты ручной работы из натуральных ингредиентов',
      products,
      reviews,
    };
  }

  @Get('about')
  @Render('about')
  getAboutPage() {
    return {
      title: 'О нас - Dessert boutique',
      description: 'О кондитерской Dessert boutique',
    };
  }

  @Get('history_desserts')
  @Render('history_desserts')
  getHistoryDessertsPage() {
    return {
      title: 'Истории десертов - Dessert boutique',
      description: 'Истории знаменитых десертов',
    };
  }

  @Get('prices')
  @Render('prices')
  getPricesPage() {
    return {
      title: 'Цены - Dessert boutique',
      description: 'Цены на десерты Dessert boutique',
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContactsPage() {
    return {
      title: 'Контакты - Dessert boutique',
      description: 'Контакты Dessert boutique',
    };
  }
}
