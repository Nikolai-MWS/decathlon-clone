import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock_notifications')
export class StockNotification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  skuId!: string;

  @Column()
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
