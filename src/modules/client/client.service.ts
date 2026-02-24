import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientEntity } from './entities/client.entity';
import { generateId } from 'src/shared/utils/generateId';
import { LoggerService } from 'src/shared/services/logger.service';
import { byOrderItem } from 'src/shared/utils/byOrderItems';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly loggerService: LoggerService,
  ) {}

  async add(client: {
    firstnames: string;
    lastnames: string;
  }): Promise<ClientEntity> {
    const existingClient = await this.clientRepository.findOneBy({
      firstnames: client.firstnames,
      lastnames: client.lastnames,
    });

    if (existingClient) {
      this.loggerService.warn(
        `Intento de registro con cliente ya existente: ${client.firstnames} ${client.lastnames}`,
      );
      throw new HttpException('Este cliente ya existe', HttpStatus.CONFLICT);
    }

    return await this.clientRepository.save({
      id: generateId(),
      firstnames: client.firstnames,
      lastnames: client.lastnames,
    });
  }

  async getAll(
    onlyWithPurchases: boolean,
    field: 'createdAt' | 'name' = 'name',
    direction: 'asc' | 'desc' = 'asc',
  ): Promise<ClientEntity[] | null> {
    let clients: ClientEntity[] = [];

    if (onlyWithPurchases) {
      clients = await this.clientRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.purchases', 'purchase')
        .groupBy('client.id')
        .having('COUNT(purchase.id) > 0')
        .getMany();
    } else {
      clients = await this.clientRepository.find();
    }

    return byOrderItem(clients, field, direction);
  }

  async findById(id: string): Promise<ClientEntity | null> {
    return await this.clientRepository.findOneBy({ id });
  }

  async update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity> {
    await this.clientRepository.update(id, data);

    return (await this.clientRepository.findOneBy({ id })) as ClientEntity;
  }

  async deactivate(id: string): Promise<void> {
    const client = await this.clientRepository.findOneBy({ id });

    if (!client) {
      throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    await this.clientRepository.softDelete(id);
  }
}
