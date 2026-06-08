import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../catalog/entities/product.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { StockNotification } from './entities/stock-notification.entity';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wishlist,
      WishlistItem,
      Product,
      NewsletterSubscriber,
      StockNotification,
    ]),
  ],
  controllers: [EngagementController],
  providers: [EngagementService],
})
export class EngagementModule {}
