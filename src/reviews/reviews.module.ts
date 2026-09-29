import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsApiController } from './reviews-api.controller';
import { ReviewsResolver } from './graphql/reviews.resolver';
import { ReviewOwnerOrAdminGuard } from './review-owner-or-admin.guard';
import { CatalogModule } from '../catalog/catalog.module';
import { AuthRedirectMiddleware } from '../auth/auth-redirect.middleware';

@Module({
  imports: [CatalogModule],
  controllers: [ReviewsController, ReviewsApiController],
  providers: [ReviewsService, ReviewsResolver, ReviewOwnerOrAdminGuard],
  exports: [ReviewsService],
})
export class ReviewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthRedirectMiddleware).forRoutes(
      {
        path: 'reviews/add',
        method: RequestMethod.GET,
      },
      {
        path: 'reviews',
        method: RequestMethod.POST,
      },
      {
        path: 'reviews/:id/edit',
        method: RequestMethod.GET,
      },
      {
        path: 'reviews/:id',
        method: RequestMethod.PATCH,
      },
      {
        path: 'reviews/:id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
