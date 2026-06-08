import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  slug!: string;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent!: Category | null;

  @Column({ type: 'uuid', nullable: true })
  parentId!: string | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];
}
