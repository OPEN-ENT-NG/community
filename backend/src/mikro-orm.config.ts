import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';

config(); // Charger les variables d'environnement

const configService = new ConfigService();

const mikroOrmConfig: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL || configService.get('db.postgres.url'),
  user: process.env.DATABASE_USER || configService.get('db.postgres.user'),
  password: process.env.DATABASE_PASSWORD || configService.get('db.postgres.password'),
  debug: process.env.NODE_ENV !== 'production',
  pool: {
    min: 1,
    max: 10,
  },
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: './migrations',
    pathTs: './src/migrations',
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: false,
    tableName: 'mikro_orm_migrations',
    transactional: true,
    migrationsList: [
      {
        name: '01-init.sql',
        class: '01InitMigration',
      },
    ],
  },
};

export default mikroOrmConfig;