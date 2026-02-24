import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { SaleDetailEntity } from './sale-detail.entity';

@Entity()
export class SaleEntity {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => ClientEntity, (client) => client.purchases)
  client: ClientEntity;

  @OneToMany(() => SaleDetailEntity, (detail) => detail.sale, {
    cascade: true,
  })
  details: SaleDetailEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
