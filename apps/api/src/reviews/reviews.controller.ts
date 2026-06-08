import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { type ReviewDto, type ReviewsResponseDto } from '@decathlon/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('products/:slug/reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  list(@Param('slug') slug: string): Promise<ReviewsResponseDto> {
    return this.reviews.listForProduct(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReviewDto> {
    return this.reviews.create(slug, user.id, dto);
  }
}
