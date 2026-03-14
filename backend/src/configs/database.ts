import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { resolve } from 'path';

const srcPath = resolve(__dirname, '..');

export const databaseConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [srcPath + '/entities/*.entity.{js,ts}'],
  migrations: [srcPath + '/migrations/*.{js,ts}'],
  migrationsRun: true,
  synchronize: true,
};

export const dataSource = new DataSource(databaseConfig);
