import {
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { SaleDetailEntity } from './sale-detail.entity';

@Entity()
export class SaleEntity {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => ClientEntity, (client) => client.purchases)
  client: ClientEntity;

  @ManyToMany(() => ProductEntity, (product) => product.sales)
  @JoinTable()
  products: ProductEntity[];

  @OneToMany(() => SaleDetailEntity, (detail) => detail.sale, {
    cascade: true,
  })
  details: SaleDetailEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
