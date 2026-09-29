import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogApiController } from './catalog-api.controller';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './graphql/catalog.resolver';
import { ObjectStorageModule } from '../object-storage/object-storage.module';
import { AuthRedirectMiddleware } from '../auth/auth-redirect.middleware';

@Module({
  imports: [ObjectStorageModule],
  controllers: [CatalogController, CatalogApiController],
  providers: [CatalogService, CatalogResolver],
  exports: [CatalogService],
})
export class CatalogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthRedirectMiddleware).forRoutes(
      {
        path: 'products/add',
        method: RequestMethod.GET,
      },
      {
        path: 'products/categories/add',
        method: RequestMethod.GET,
      },
      {
        path: 'products/:id/edit',
        method: RequestMethod.GET,
      },
    );
  }
}
