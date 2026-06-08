import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @Column({ type: 'uuid' })
  orderId!: string;

  // Snapshot of the purchased item (independent of later catalog changes).
  @Column({ type: 'uuid', nullable: true }) skuId!: string | null;
  @Column() productName!: string;
  @Column({ default: '' }) brand!: string;
  @Column({ default: '' }) color!: string;
  @Column({ default: '' }) size!: string;
  @Column({ type: 'varchar', nullable: true }) image!: string | null;
  @Column({ type: 'int' }) unitEur!: number;
  @Column({ type: 'int' }) quantity!: number;
}
