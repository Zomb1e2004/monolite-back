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

  async getAll(): Promise<ProductEntity[] | null> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOneBy({ id });
  }
}
