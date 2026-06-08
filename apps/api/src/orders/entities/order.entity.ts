import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { type DeliveryMethod, type OrderStatus } from '@decathlon/shared';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @Column()
  email!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: OrderStatus;

  @Column({ type: 'varchar' })
  deliveryMethod!: DeliveryMethod;

  // Shipping address snapshot
  @Column() fullName!: string;
  @Column({ default: '' }) phone!: string;
  @Column() line1!: string;
  @Column() city!: string;
  @Column() postalCode!: string;
  @Column({ default: 'BG' }) country!: string;

  @Column({ type: 'int' }) subtotalEur!: number;
  @Column({ type: 'int' }) shippingEur!: number;
  @Column({ type: 'int' }) totalEur!: number;

  @Column({ type: 'varchar', nullable: true })
  paymentIntentId!: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
