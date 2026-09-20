import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ReviewsService } from '../reviews.service';
import { CatalogService } from '../../catalog/catalog.service';
import { PaginationArgs } from '../../common/graphql/pagination.args';

import { ReviewType } from './types/review.type';
import { ReviewPageType } from './types/review-page.type';
import { DessertType } from '../../catalog/graphql/types/dessert.type';

import { CreateReviewInput } from './inputs/create-review.input';
import { UpdateReviewInput } from './inputs/update-review.input';

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly catalogService: CatalogService,
  ) {}

  @Query(() => ReviewPageType, {
    description: 'Получить страницу отзывов',
  })
  async reviews(@Args() pagination: PaginationArgs) {
    const result = await this.reviewsService.findAllPage(
      pagination.page,
      pagination.limit,
    );

    return {
      items: result.items,
      total: result.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(result.total / pagination.limit),
    };
  }

  @Query(() => ReviewType, {
    description: 'Получить отзыв по идентификатору',
  })
  async review(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор отзыва',
    })
    id: number,
  ) {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => ReviewType, {
    description: 'Создать новый отзыв',
  })
  async createReview(
    @Args('input')
    input: CreateReviewInput,
  ) {
    return this.reviewsService.create(input);
  }

  @Mutation(() => ReviewType, {
    description: 'Изменить отзыв',
  })
  async updateReview(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор отзыва',
    })
    id: number,

    @Args('input')
    input: UpdateReviewInput,
  ) {
    return this.reviewsService.update(id, input);
  }

  @Mutation(() => Boolean, {
    description: 'Удалить отзыв',
  })
  async deleteReview(
    @Args('id', {
      type: () => Int,
      description: 'Идентификатор отзыва',
    })
    id: number,
  ): Promise<boolean> {
    await this.reviewsService.remove(id);

    return true;
  }

  @ResolveField(() => DessertType, {
    name: 'dessert',
    description: 'Получить десерт, к которому относится отзыв',
  })
  async dessert(@Parent() review: ReviewType) {
    const dessert = await this.catalogService.findDessertById(review.dessertId);

    return {
      ...dessert,
      price: Number(dessert.price),
    };
  }
}
