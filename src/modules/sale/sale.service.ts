import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaleEntity } from './entities/sale.entity';
import { SaleDetailEntity } from './entities/sale-detail.entity';

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

  async register(sale: {
    clientId: string;
    products: { productId: string; quantity: number }[];
  }) {
    const client = await this.clientService.findById(sale.clientId);

    if (!client) {
      this.loggerService.warn(
        `Intento de registro de compra con cliente inexistente`,
      );
      throw new HttpException('Cliente inexistente', HttpStatus.NOT_FOUND);
    }

    const details: SaleDetailEntity[] = [];

    for (const item of sale.products) {
      const product = await this.productService.findById(item.productId);

      if (!product) {
        this.loggerService.warn(
          `Intento de registro de compra con producto inexistente`,
        );
        throw new HttpException(
          `Producto inexistente: ${item.productId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      details.push({
        id: generateId(),
        product,
        quantity: item.quantity,
      } as SaleDetailEntity);
    }

    const newSale = this.saleRepository.create({
      id: generateId(),
      client,
      details,
    });

    return await this.saleRepository.save(newSale);
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
    return await this.saleRepository.find({
      relations: {
        client: true,
        details: {
          product: true,
        },
      },
    });
  }
}
