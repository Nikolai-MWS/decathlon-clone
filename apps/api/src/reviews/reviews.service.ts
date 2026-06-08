import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  type CreateReviewInput,
  type ReviewDto,
  type ReviewsResponseDto,
} from '@decathlon/shared';
import { Product } from '../catalog/entities/product.entity';
import { UsersService } from '../users/users.service';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly users: UsersService,
  ) {}

  private async productBySlug(slug: string): Promise<Product> {
    const product = await this.products.findOne({ where: { slug } });
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    return product;
  }

  async listForProduct(slug: string): Promise<ReviewsResponseDto> {
    const product = await this.productBySlug(slug);
    const rows = await this.reviews.find({
      where: { productId: product.id },
      order: { createdAt: 'DESC' },
    });
    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of rows) breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1;

    return {
      summary: {
        average: Number(product.ratingAvg),
        count: product.reviewCount,
        breakdown,
      },
      items: rows.map(toReviewDto),
    };
  }

  async create(slug: string, userId: string, input: CreateReviewInput): Promise<ReviewDto> {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    const product = await this.productBySlug(slug);
    const existing = await this.reviews.findOne({ where: { productId: product.id, userId } });
    if (existing) throw new ConflictException('You have already reviewed this product');

    const user = await this.users.findById(userId);
    const authorName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Клиент';

    const review = await this.reviews.save(
      this.reviews.create({
        productId: product.id,
        userId,
        authorName: authorName || 'Клиент',
        rating: input.rating,
        title: input.title,
        body: input.body,
      }),
    );

    // Incrementally fold the new rating into the denormalized aggregate.
    const oldCount = product.reviewCount;
    const oldAvg = Number(product.ratingAvg);
    const newCount = oldCount + 1;
    const newAvg = (oldAvg * oldCount + input.rating) / newCount;
    product.reviewCount = newCount;
    product.ratingAvg = Math.round(newAvg * 10) / 10;
    await this.products.save(product);

    return toReviewDto(review);
  }
}

function toReviewDto(r: Review): ReviewDto {
  return {
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  };
}
