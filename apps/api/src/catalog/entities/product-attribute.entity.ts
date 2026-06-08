import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { type AttributeSection } from '@decathlon/shared';
import { Product } from './product.entity';

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, (product) => product.attributes, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'varchar' })
  section!: AttributeSection;

  @Column({ default: '' })
  label!: string;

  @Column({ type: 'text', default: '' })
  value!: string;

  @Column({ type: 'int', default: 0 })
  position!: number;
}
