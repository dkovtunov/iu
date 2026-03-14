import { CryptoRepository } from './crypto.repository';
import { hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoRepositoryImpl implements CryptoRepository {
  hashBcrypt(data: string): Promise<string> {
    return hash(data, 10);
  }
}

export const CryptoRepositoryProvider = {
  provide: 'CryptoRepository',
  useClass: CryptoRepositoryImpl,
};
