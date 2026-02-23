import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(id, data);

    return (await this.userRepository.findOneBy({ id })) as UserEntity;
  }

  async getAll(): Promise<UserEntity[] | null> {
    return await this.userRepository.find({
      select: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
    });
  }

  async findById(id: string, withPassword = false): Promise<UserEntity | null> {
    const selectFields = ['id', 'username', 'email', 'createdAt', 'updatedAt'];
    if (withPassword) selectFields.push('password');

    return await this.userRepository.findOne({
      where: { id },
      select: selectFields as (keyof UserEntity)[],
    });
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserEntity | null> {
    const selectFields = ['id', 'username', 'email', 'createdAt', 'updatedAt'];
    if (withPassword) selectFields.push('password');

    return await this.userRepository.findOne({
      where: { email },
      select: selectFields as (keyof UserEntity)[],
    });
  }
}
