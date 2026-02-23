import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  exports: [ClientService],
})
export class ClientModule {}
