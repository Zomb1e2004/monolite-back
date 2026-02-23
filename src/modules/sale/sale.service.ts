import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaleEntity } from './entities/sale.entity';
import { ProductEntity } from '../product/entities/product.entity';

import { LoggerService } from 'src/shared/services/logger.service';
import { ClientService } from '../client/client.service';

import { generateId } from 'src/shared/utils/generateId';
import { ProductService } from '../product/product.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
    private readonly clientService: ClientService,
    private readonly loggerService: LoggerService,
    private readonly productService: ProductService,
  ) {}

  async register(sale: { clientId: string; products: string[] }) {
    const client = await this.clientService.findById(sale.clientId);
    if (!client) {
      this.loggerService.warn(
        `Intento de registro de compra con cliente inexistente`,
      );

      throw new HttpException('Cliente inexistente', HttpStatus.NOT_FOUND);
    }

    const validProducts: ProductEntity[] = (
      await Promise.all(
        sale.products.map((id) => this.productService.findById(id)),
      )
    ).filter((p): p is ProductEntity => p !== null);

    return await this.saleRepository.save({
      id: generateId(),
      client,
      products: validProducts,
    });
  }

  async delete(saleId: string) {
    await this.saleRepository.delete(saleId);
  }

  async update(id: string, data: Partial<SaleEntity>): Promise<SaleEntity> {
    await this.saleRepository.update(id, data);

    return (await this.saleRepository.findOneBy({ id })) as SaleEntity;
  }

  async getByClient(clientId: string) {
    const client = await this.clientService.findById(clientId);
    if (!client) {
      this.loggerService.warn(
        `Intento de consulta de ventas de cliente inexistente`,
      );

      throw new HttpException('Cliente inexistente', HttpStatus.NOT_FOUND);
    }

    return await this.saleRepository.find({
      where: { client: { id: clientId } },
      relations: ['products'],
    });
  }

  async findById(id: string) {
    return this.saleRepository.findOneBy({ id });
  }

  async getAll() {
    return await this.saleRepository.find();
  }
}
