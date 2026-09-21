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
