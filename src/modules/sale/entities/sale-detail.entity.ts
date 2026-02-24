import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { SaleEntity } from './sale.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';

@Entity('sale_detail')
export class SaleDetailEntity {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => SaleEntity, (sale) => sale.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sale_id' })
  sale: SaleEntity;

  @ManyToOne(() => ProductEntity, (product) => product.saleDetails, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;
}
