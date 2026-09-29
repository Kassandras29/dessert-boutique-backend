import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ComplexityPlugin } from './common/graphql/complexity.plugin';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';
import type { Request, Response } from 'express';
import { ETagInterceptor } from './common/interceptors/etag.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    CatalogModule,
    CustomersModule,
    OrdersModule,
    ReviewsModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5000,
    }),

    AuthModule.register({
      connectionUri: process.env.SUPERTOKENS_CONNECTION_URI ?? '',
      apiKey: process.env.SUPERTOKENS_API_KEY ?? '',
      appName: process.env.SUPERTOKENS_APP_NAME ?? 'Dessert Boutique',
      appUrl: process.env.APP_URL ?? 'http://localhost:9021',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ComplexityPlugin,
    {
      provide: APP_INTERCEPTOR,
      useClass: ElapsedTimeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ETagInterceptor,
    },
  ],
})
export class AppModule {}
