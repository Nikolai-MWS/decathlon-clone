import 'reflect-metadata';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Load apps/api/.env regardless of the current working directory.
// At runtime __dirname is dist/database; under ts-node it is src/database.
// Either way, ../../.env resolves to apps/api/.env.
loadEnv({ path: resolve(__dirname, '../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'decathlon',
  password: process.env.DB_PASSWORD ?? 'decathlon',
  database: process.env.DB_NAME ?? 'decathlon',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
