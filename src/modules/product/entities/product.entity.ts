import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SaleDetailEntity } from 'src/modules/sale/entities/sale-detail.entity';

@Entity()
export class ProductEntity {
  @PrimaryColumn('text')
  id: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => SaleDetailEntity, (detail) => detail.product)
  saleDetails: SaleDetailEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
