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

  async add(product: { name: string; stock: number }): Promise<ProductEntity> {
    const existingProduct = await this.productRepository.findOneBy({
      name: product.name,
    });

    if (!existingProduct) {
      const newProduct = await this.productRepository.save({
        id: generateId(),
        name: product.name,
        stock: product.stock ?? 1,
      });

      return newProduct;
    }

    existingProduct.stock += product.stock;
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

  async delete(
    id: string,
    quantity?: number,
  ): Promise<ProductEntity | boolean> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      this.loggerService.log('Se intentó eliminar un producto inexistente');
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    if (quantity && quantity > 0) {
      if (product.stock <= quantity) {
        await this.productRepository.remove(product);

        return true;
      } else {
        product.stock -= quantity;
        await this.productRepository.save(product);

        return product;
      }
    }

    await this.productRepository.remove(product);
    return true;
  }

  async getAll(): Promise<ProductEntity[] | null> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOneBy({ id });
  }
}
