import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaleEntity } from './entities/sale.entity';
import { SaleDetailEntity } from './entities/sale-detail.entity';

import { LoggerService } from 'src/shared/services/logger.service';
import { ClientService } from '../client/client.service';

import { generateId } from 'src/shared/utils/generateId';
import { ProductService } from '../product/product.service';
import { byOrderItem } from 'src/shared/utils/byOrderItems';

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

      if (product.stock < item.quantity) {
        throw new HttpException(
          `Stock insuficiente para el producto: ${product.id}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      product.stock -= item.quantity;
      await this.productService.update(product.id, product);

      details.push({
        id: generateId(),
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      } as SaleDetailEntity);
    }

    const totalAmount = details.reduce((sum, d) => sum + d.subtotal, 0);

    const newSale = this.saleRepository.create({
      id: generateId(),
      client,
      details,
      totalAmount,
    });

    return await this.saleRepository.save(newSale);
  }

  async cancel(saleId: string) {
    const sale = await this.saleRepository.findOne({
      where: { id: saleId },
      relations: {
        details: {
          product: true,
        },
      },
    });

    if (!sale) {
      this.loggerService.warn(`Intento de cancelación de compra inexistente`);
      throw new HttpException('La venta no existe', HttpStatus.NOT_FOUND);
    }

    for (const detail of sale.details) {
      await this.productService.update(detail.product.id, {
        stock: detail.product.stock + detail.quantity,
      });
    }

    await this.saleRepository.softDelete(saleId);
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
      relations: {
        client: true,
        details: {
          product: true,
        },
      },
      withDeleted: true,
    });
  }

  async findById(id: string) {
    return this.saleRepository.findOne({
      where: { id },
      relations: {
        client: true,
        details: {
          product: true,
        },
      },
      withDeleted: true,
    });
  }

  async getAll(
    field: 'createdAt' | 'name' = 'name',
    direction: 'asc' | 'desc' = 'asc',
  ) {
    const sales = await this.saleRepository.find({
      relations: {
        client: true,
        details: {
          product: true,
        },
      },
      withDeleted: true,
    });

    return byOrderItem(sales, field, direction);
  }
}
