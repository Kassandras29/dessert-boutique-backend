import { Module } from '@nestjs/common';

import { CatalogController } from './catalog.controller';
import { CatalogApiController } from './catalog-api.controller';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './graphql/catalog.resolver';
import { ObjectStorageModule } from '../object-storage/object-storage.module';

@Module({
  imports: [ObjectStorageModule],
  controllers: [CatalogController, CatalogApiController],
  providers: [CatalogService, CatalogResolver],
  exports: [CatalogService],
})
export class CatalogModule {}
