import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SaleEntity } from 'src/modules/sale/entities/sale.entity';

@Entity()
export class ProductEntity {
  @PrimaryColumn('text')
  id: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @ManyToMany(() => SaleEntity, (sale) => sale.products)
  sales: SaleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
