import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import hbs from 'hbs';
import methodOverride from 'method-override';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.APP_URL ?? 'http://localhost:9021',

    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],

    credentials: true,
  });
  app.use(methodOverride('_method'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dessert Boutique API')
    .setDescription('REST API кондитерской Dessert Boutique')
    .setVersion('1.0')
    .addSecurity('supertokens', {
      type: 'apiKey',
      in: 'cookie',
      name: 'sAccessToken',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = Number(process.env.PORT) || 9020;
  await app.listen(port);
}

void bootstrap();
