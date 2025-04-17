import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ConfigService } from "@nestjs/config";
import { Migration20240701000000 } from "@app/migrations/01InitMigration";

export function createPostgresOptions(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const schema = <string>configService.get("db.postgres.schema");
  return {
    driver: PostgreSqlDriver,
    clientUrl: configService.get("db.postgres.url"),
    user: configService.get("db.postgres.user"),
    password: configService.get("db.postgres.password"),
    debug: configService.get("db.postgres.debug"),
    pool: {
      min: configService.get<number>("db.postgres.pool.min", 1),
      max: configService.get<number>("db.postgres.pool.max", 1),
    },
    entities: ["./dist/**/*.entity.js"], // Updated to look across all modules
    entitiesTs: ["./src/**/*.entity.ts"], // Updated to look across all modules
    autoLoadEntities: true,
    extensions: [],
    migrations: {
      path: "./migrations",
      pathTs: "./src/migrations",
      disableForeignKeys: false,
      allOrNothing: true,
      dropTables: false,
      safe: false,
      snapshot: false,
      tableName: `${schema}_mikro_orm_migrations`,
      transactional: true,
      migrationsList: [Migration20240701000000],
    },
  };
}
