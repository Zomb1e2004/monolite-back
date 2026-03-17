import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { SaleDetailEntity } from './sale-detail.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity()
export class SaleEntity {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => ClientEntity, (client) => client.purchases)
  client: ClientEntity;

  @ManyToOne(() => UserEntity, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => SaleDetailEntity, (detail) => detail.sale, {
    cascade: true,
  })
  details: SaleDetailEntity[];

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
