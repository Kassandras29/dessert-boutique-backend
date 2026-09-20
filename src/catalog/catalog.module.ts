import { Module } from '@nestjs/common';

import { CatalogController } from './catalog.controller';
import { CatalogApiController } from './catalog-api.controller';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './graphql/catalog.resolver';

@Module({
  controllers: [CatalogController, CatalogApiController],
  providers: [CatalogService, CatalogResolver],
  exports: [CatalogService],
})
export class CatalogModule {}
