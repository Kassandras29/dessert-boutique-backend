import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {
  private getProducts() {
    return [
      {
        className: 'product__card_madeleines',
        image: '/img/madeleines.jpg',
        alt: 'Набор мадленов',
        name: 'Набор мадленов',
        description: 'На день учителя',
      },
      {
        className: 'product__card_christmas-cheesecake',
        image: '/img/christmas_cheesecake.jpg',
        alt: 'Новогодний чизкейк',
        name: 'Новогодний чизкейк',
        description: 'С ягодным ассорти',
      },
      {
        className: 'product__card_valentines',
        image: '/img/valentines.jpg',
        alt: 'Валентинки набор моти',
        name: 'Валентинки',
        description: 'Набор моти',
      },
      {
        className: 'product__card_easter',
        image: '/img/easter-crafin.jpg',
        alt: 'Пасхальный крафин',
        name: 'Пасхальный крафин',
        description: 'С изюмом и цукатами',
      },
    ];
  }

  @Get()
  @Render('index')
  getIndexPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
      products: this.getProducts(),
    };
  }

  @Get('about')
  @Render('about')
  getAboutPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'О нас - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
    };
  }

  @Get('products')
  @Render('products')
  getProductsPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Каталог - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
      products: this.getProducts(),
    };
  }

  @Get('history_desserts')
  @Render('history_desserts')
  getHistoryDessertsPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Истории десертов - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
    };
  }

  @Get('reviews')
  @Render('reviews')
  getReviewsPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Отзывы - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
      isReviewsPage: true,
    };
  }

  @Get('prices')
  @Render('prices')
  getPricesPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Цены - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
    };
  }

  @Get('contacts')
  @Render('contacts')
  getContactsPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Контакты - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
    };
  }

  @Get('users')
  @Render('users')
  getUsersPage(@Query('auth') auth?: string) {
    const isAuthenticated = auth === '1';

    return {
      title: 'Наши клиенты - Dessert boutique',
      user: isAuthenticated ? { name: 'Irina' } : null,
    };
  }
}
