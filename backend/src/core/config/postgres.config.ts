import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ConfigService } from "@nestjs/config";

export function createPostgresOptions(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const schema = <string>configService.get("db.postgres.schema");
  return {
    validate: true,
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
    extensions: [],
    migrations: {
      path: "./dist/migrations",
      pathTs: "./src/migrations",
      disableForeignKeys: false,
      allOrNothing: true,
      dropTables: false,
      safe: false,
      snapshot: false,
      tableName: `${schema}_mikro_orm_migrations`,
      transactional: true,
    },
  };
}
