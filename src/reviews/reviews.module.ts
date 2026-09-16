import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsApiController } from './reviews-api.controller';

@Module({
  controllers: [ReviewsController, ReviewsApiController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
