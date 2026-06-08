import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../catalog/entities/product.entity';

@Entity('reviews')
@Index(['productId', 'userId'], { unique: true })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  authorName!: string;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ default: '' })
  title!: string;

  @Column({ type: 'text', default: '' })
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
