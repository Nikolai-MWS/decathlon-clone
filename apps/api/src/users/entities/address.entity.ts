import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  fullName!: string;

  @Column({ default: '' })
  phone!: string;

  @Column()
  line1!: string;

  @Column()
  city!: string;

  @Column()
  postalCode!: string;

  @Column({ default: 'BG' })
  country!: string;

  @Column({ default: false })
  isDefault!: boolean;
}
