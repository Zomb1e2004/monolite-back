import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { LoggerService } from 'src/shared/services/logger.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';

@Module({
  providers: [ClientService, LoggerService],
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  exports: [ClientService],
})
export class ClientModule {}
