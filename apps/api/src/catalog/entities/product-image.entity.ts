import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.images, { onDelete: 'CASCADE' })
  variant!: ProductVariant;

  @Column({ type: 'uuid' })
  variantId!: string;

  @Column()
  url!: string;

  @Column({ type: 'int', default: 0 })
  position!: number;
}
