import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Entity('wishlist_items')
@Index(['wishlistId', 'productId'], { unique: true })
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  wishlist!: Wishlist;

  @Column({ type: 'uuid' })
  wishlistId!: string;

  @Column({ type: 'uuid' })
  productId!: string;
}
