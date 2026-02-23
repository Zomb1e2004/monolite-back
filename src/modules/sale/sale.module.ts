import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { LoggerService } from 'src/shared/services/logger.service';
import { ClientService } from '../client/client.service';
import { ClientController } from '../client/client.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ClientModule, ProductModule],
  providers: [LoggerService, ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class SaleModule {}
