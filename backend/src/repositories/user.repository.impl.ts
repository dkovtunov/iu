import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from './user.repository';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}
  async create(entity: DeepPartial<UserEntity>): Promise<UserEntity> {
    await this.repository.save(entity);

    return this.repository.findOneOrFail({
      where: {
        email: entity.email,
      },
    });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ email });
  }
}

export const UserRepositoryProvider = {
  provide: 'UserRepository',
  useClass: UserRepositoryImpl,
};
