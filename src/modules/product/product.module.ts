import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { LoggerService } from 'src/shared/services/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
  providers: [ProductService, LoggerService],
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  exports: [ProductService],
})
export class ProductModule {}
