import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { Sku } from './sku.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column()
  colorName!: string;

  @Index({ unique: true })
  @Column()
  slug!: string;

  @OneToMany(() => ProductImage, (image) => image.variant, { cascade: true })
  images!: ProductImage[];

  @OneToMany(() => Sku, (sku) => sku.variant, { cascade: true })
  skus!: Sku[];
}
