import { Controller, Get, Render } from '@nestjs/common';

@Controller('auth')
export class AuthPagesController {
  @Get('login')
  @Render('login')
  getLoginPage() {
    return {
      title: 'Вход - Dessert boutique',
    };
  }

  @Get('register')
  @Render('register')
  getRegisterPage() {
    return {
      title: 'Регистрация - Dessert boutique',
    };
  }
}
