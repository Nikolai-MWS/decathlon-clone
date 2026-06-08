import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('prices')
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Product, (product) => product.price, { onDelete: 'CASCADE' })
  @JoinColumn()
  product!: Product;

  @Column({ type: 'uuid' })
  productId!: string;

  /** Current price in euro cents. */
  @Column({ type: 'int' })
  currentEur!: number;

  /** Original price in euro cents, when discounted. */
  @Column({ type: 'int', nullable: true })
  oldEur!: number | null;

  @Column({ type: 'int', nullable: true })
  discountPct!: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  promoStart!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  promoEnd!: Date | null;
}
