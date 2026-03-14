import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  getByEmail(username: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
}
