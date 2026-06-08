import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { Price } from './price.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  slug!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'RESTRICT', eager: true })
  brand!: Brand;

  @Column({ type: 'uuid' })
  brandId!: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT', eager: true })
  category!: Category;

  @Column({ type: 'uuid' })
  categoryId!: string;

  @Column({ type: 'numeric', precision: 2, scale: 1, default: 0 })
  ratingAvg!: number;

  @Column({ type: 'int', default: 0 })
  reviewCount!: number;

  @OneToOne(() => Price, (price) => price.product, { cascade: true })
  price!: Price;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants!: ProductVariant[];

  @OneToMany(() => ProductAttribute, (attr) => attr.product, { cascade: true })
  attributes!: ProductAttribute[];

  @CreateDateColumn()
  createdAt!: Date;
}
