import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { LoggerService } from 'src/shared/services/logger.service';
import { ProductModule } from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './entities/sale.entity';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleDetailEntity } from './entities/sale-detail.entity';

@Module({
  imports: [
    ClientModule,
    ProductModule,
    TypeOrmModule.forFeature([SaleEntity, SaleDetailEntity]),
  ],
  providers: [LoggerService, SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
