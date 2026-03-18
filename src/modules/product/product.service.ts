import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './entities/product.entity';
import { generateId } from 'src/shared/utils/generateId';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async add(product: {
    name: string;
    price: number;
    stock?: number;
  }): Promise<ProductEntity> {
    const existingProduct = await this.productRepository.findOneBy({
      name: product.name,
    });

    if (!existingProduct) {
      const newProduct = await this.productRepository.save({
        id: generateId(),
        name: product.name,
        price: product.price,
        stock: product.stock ?? 1,
      });

      return newProduct;
    }

    existingProduct.stock += product.stock ?? 1;
    existingProduct.updatedAt = new Date();

    await this.productRepository.save(existingProduct);

    this.loggerService.log(
      `Stock actualizado de producto: ${existingProduct.name}`,
    );

    return existingProduct;
  }

  async update(
    id: string,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    await this.productRepository.update(id, data);

    return (await this.productRepository.findOneBy({ id })) as ProductEntity;
  }

  async reduceStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      this.loggerService.log('Se intentó modificar un producto inexistente');
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    if (quantity <= 0) {
      throw new HttpException(
        'La cantidad debe ser mayor a 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (product.stock <= quantity) {
      await this.productRepository.softDelete(id);
      return product;
    }

    product.stock -= quantity;
    await this.productRepository.save(product);

    return product;
  }

  async deactivate(id: string): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    await this.productRepository.softDelete(id);
  }

  async getAll(
    field: 'createdAt' | 'name' = 'name',
    direction: 'asc' | 'desc' = 'asc',
  ): Promise<
    {
      id: string;
      name: string;
      stock: number;
      price: number;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      totalSold: number;
    }[]
  > {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.saleDetails', 'detail')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.stock', 'stock')
      .addSelect('product.price', 'price')
      .addSelect('product.createdAt', 'createdAt')
      .addSelect('product.updatedAt', 'updatedAt')
      .addSelect('product.deletedAt', 'deletedAt')
      .addSelect('COALESCE(SUM(detail.quantity), 0)', 'totalSold')
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.stock')
      .addGroupBy('product.price')
      .addGroupBy('product.createdAt')
      .addGroupBy('product.updatedAt')
      .addGroupBy('product.deletedAt')
      .orderBy(`product.${field}`, direction.toUpperCase() as 'ASC' | 'DESC')
      .getRawMany<{
        id: string;
        name: string;
        stock: number;
        price: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        totalSold: number;
      }>();

    return products || [];
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOneBy({ id });
  }

  async getTopSellingProducts(): Promise<
    { id: string; name: string; stock: number; totalSold: number }[]
  > {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.saleDetails', 'detail')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.stock', 'stock')
      .addSelect('SUM(detail.quantity)', 'totalSold')
      .groupBy('product.id')
      .orderBy('totalSold', 'DESC')
      .limit(5)
      .getRawMany<{
        id: string;
        name: string;
        stock: number;
        totalSold: number;
      }>();

    return result || [];
  }
}
