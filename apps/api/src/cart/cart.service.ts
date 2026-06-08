import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type CartDto, type CartLineDto, eurCentsToMoney } from '@decathlon/shared';
import { Sku } from '../catalog/entities/sku.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    @InjectRepository(CartItem) private readonly items: Repository<CartItem>,
    @InjectRepository(Sku) private readonly skus: Repository<Sku>,
  ) {}

  async createCart(): Promise<Cart> {
    return this.carts.save(this.carts.create({ items: [] }));
  }

  /** Public access to the fully-loaded cart entity (used by checkout). */
  getCartEntity(cartId: string): Promise<Cart | null> {
    return this.loadCart(cartId);
  }

  async clearCart(cartId: string): Promise<void> {
    await this.items.delete({ cartId });
  }

  /** Loads a cart with everything needed to render lines, or null. */
  private loadCart(cartId: string): Promise<Cart | null> {
    return this.carts
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'item')
      .leftJoinAndSelect('item.sku', 'sku')
      .leftJoinAndSelect('sku.variant', 'variant')
      .leftJoinAndSelect('variant.images', 'image')
      .leftJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('product.price', 'price')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('cart.id = :cartId', { cartId })
      .orderBy('item.id', 'ASC')
      .addOrderBy('image.position', 'ASC')
      .getOne();
  }

  async getCartDto(cartId: string | undefined): Promise<CartDto | null> {
    if (!cartId) return null;
    const cart = await this.loadCart(cartId);
    return cart ? this.toDto(cart) : null;
  }

  async addItem(cartId: string, skuId: string, quantity: number): Promise<CartDto> {
    if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');
    const sku = await this.skus.findOne({ where: { id: skuId } });
    if (!sku) throw new NotFoundException('SKU not found');

    let item = await this.items.findOne({ where: { cartId, skuId } });
    const desired = (item?.quantity ?? 0) + quantity;
    if (desired > sku.stock) {
      throw new BadRequestException(`Only ${sku.stock} in stock`);
    }
    if (item) {
      item.quantity = desired;
    } else {
      item = this.items.create({ cartId, skuId, quantity });
    }
    await this.items.save(item);
    return (await this.getCartDto(cartId))!;
  }

  async updateItem(cartId: string, itemId: string, quantity: number): Promise<CartDto> {
    const item = await this.items.findOne({ where: { id: itemId, cartId }, relations: { sku: true } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) {
      await this.items.remove(item);
      return (await this.getCartDto(cartId))!;
    }
    if (quantity > item.sku.stock) {
      throw new BadRequestException(`Only ${item.sku.stock} in stock`);
    }
    item.quantity = quantity;
    await this.items.save(item);
    return (await this.getCartDto(cartId))!;
  }

  async removeItem(cartId: string, itemId: string): Promise<CartDto> {
    await this.items.delete({ id: itemId, cartId });
    return (await this.getCartDto(cartId))!;
  }

  private toDto(cart: Cart): CartDto {
    const lines: CartLineDto[] = (cart.items ?? []).map((item) => {
      const sku = item.sku;
      const variant = sku.variant;
      const product = variant.product;
      const unitCents = product.price.currentEur;
      const image = [...(variant.images ?? [])].sort((a, b) => a.position - b.position)[0];
      return {
        itemId: item.id,
        productSlug: product.slug,
        productName: product.name,
        brand: product.brand.name,
        color: variant.colorName,
        size: sku.size,
        image: image?.url ?? null,
        unitPrice: eurCentsToMoney(unitCents),
        quantity: item.quantity,
        lineTotal: eurCentsToMoney(unitCents * item.quantity),
        maxStock: sku.stock,
      };
    });
    const subtotalCents = lines.reduce((sum, l) => sum + l.unitPrice.eurCents * l.quantity, 0);
    return {
      id: cart.id,
      items: lines,
      totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: eurCentsToMoney(subtotalCents),
    };
  }
}
