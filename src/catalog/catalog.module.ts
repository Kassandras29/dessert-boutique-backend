import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CatalogApiController } from './catalog-api.controller';

@Module({
  controllers: [CatalogController, CatalogApiController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
