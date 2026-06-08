import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sku } from '../../catalog/entities/sku.entity';
import { Cart } from './cart.entity';

@Entity('cart_items')
@Index(['cartId', 'skuId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart!: Cart;

  @Column({ type: 'uuid' })
  cartId!: string;

  @ManyToOne(() => Sku, { onDelete: 'CASCADE', eager: true })
  sku!: Sku;

  @Column({ type: 'uuid' })
  skuId!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;
}
