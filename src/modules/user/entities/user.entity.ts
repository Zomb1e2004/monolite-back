import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { SaleEntity } from 'src/modules/sale/entities/sale.entity';

@Entity()
export class UserEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLogin: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => SaleEntity, (sale) => sale.user)
  sales: SaleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
