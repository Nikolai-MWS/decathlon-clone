import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('skus')
export class Sku {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.skus, { onDelete: 'CASCADE' })
  variant!: ProductVariant;

  @Column({ type: 'uuid' })
  variantId!: string;

  @Column()
  size!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;
}
