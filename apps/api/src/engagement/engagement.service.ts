import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { type ProductCardDto } from '@decathlon/shared';
import { Product } from '../catalog/entities/product.entity';
import { toProductCard } from '../catalog/catalog.mapper';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { StockNotification } from './entities/stock-notification.entity';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlists: Repository<Wishlist>,
    @InjectRepository(WishlistItem) private readonly wishlistItems: Repository<WishlistItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(NewsletterSubscriber)
    private readonly subscribers: Repository<NewsletterSubscriber>,
    @InjectRepository(StockNotification)
    private readonly stockNotifications: Repository<StockNotification>,
  ) {}

  createWishlist(): Promise<Wishlist> {
    return this.wishlists.save(this.wishlists.create({ items: [] }));
  }

  async wishlistExists(id: string): Promise<boolean> {
    return (await this.wishlists.count({ where: { id } })) > 0;
  }

  async getWishlist(wishlistId: string): Promise<ProductCardDto[]> {
    const items = await this.wishlistItems.find({
      where: { wishlistId },
      order: { id: 'ASC' },
    });
    if (items.length === 0) return [];
    const ids = items.map((i) => i.productId);
    const products = await this.products.find({
      where: { id: In(ids) },
      relations: { brand: true, price: true, variants: { images: true } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids
      .map((id) => byId.get(id))
      .filter((p): p is Product => !!p)
      .map(toProductCard);
  }

  async addToWishlist(wishlistId: string, productId: string): Promise<ProductCardDto[]> {
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const existing = await this.wishlistItems.findOne({ where: { wishlistId, productId } });
    if (!existing) {
      await this.wishlistItems.save(this.wishlistItems.create({ wishlistId, productId }));
    }
    return this.getWishlist(wishlistId);
  }

  async removeFromWishlist(wishlistId: string, productId: string): Promise<ProductCardDto[]> {
    await this.wishlistItems.delete({ wishlistId, productId });
    return this.getWishlist(wishlistId);
  }

  async subscribe(email: string): Promise<{ ok: true }> {
    const exists = await this.subscribers.findOne({ where: { email: email.toLowerCase() } });
    if (!exists) await this.subscribers.save(this.subscribers.create({ email: email.toLowerCase() }));
    return { ok: true };
  }

  async notifyWhenInStock(skuId: string, email: string): Promise<{ ok: true }> {
    await this.stockNotifications.save(this.stockNotifications.create({ skuId, email }));
    return { ok: true };
  }
}
