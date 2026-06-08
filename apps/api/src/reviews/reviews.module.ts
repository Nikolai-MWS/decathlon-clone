import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../catalog/entities/product.entity';
import { UsersModule } from '../users/users.module';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product]), UsersModule, JwtModule.register({})],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
