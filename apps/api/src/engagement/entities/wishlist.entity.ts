import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => WishlistItem, (item) => item.wishlist, { cascade: true })
  items!: WishlistItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
