import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';

import { SaleEntity } from 'src/modules/sale/entities/sale.entity';

@Entity()
export class ClientEntity {
  @PrimaryColumn('text')
  id: string;

  @Column({ unique: true })
  firstnames: string;

  @Column({ unique: true })
  lastnames: string;

  @OneToMany(() => SaleEntity, (purchase) => purchase.client)
  purchases: SaleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
