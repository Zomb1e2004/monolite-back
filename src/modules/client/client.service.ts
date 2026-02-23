import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientEntity } from './entities/client.entity';
import { generateId } from 'src/shared/utils/generateId';
import { LoggerService } from 'src/shared/services/logger.service';

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

  async getAll(onlyWithPurchases: boolean): Promise<ClientEntity[] | null> {
    if (!onlyWithPurchases) {
      return await this.clientRepository.find();
    }

    return await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.purchases', 'purchase')
      .groupBy('client.id')
      .having('COUNT(purchase.id) > 1')
      .getMany();
  }

  async findById(id: string): Promise<ClientEntity | null> {
    return await this.clientRepository.findOneBy({ id });
  }

  async update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity> {
    await this.clientRepository.update(id, data);

    return (await this.clientRepository.findOneBy({ id })) as ClientEntity;
  }

  async delete(id: string): Promise<boolean> {
    await this.clientRepository.delete(id);

    return true;
  }
}
