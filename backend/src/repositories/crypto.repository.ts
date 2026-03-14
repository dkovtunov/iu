export interface CryptoRepository {
  hashBcrypt(data: string): Promise<string>;
}
