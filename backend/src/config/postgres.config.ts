import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ConfigService } from "@nestjs/config";

export function createPostgresOptions(
  configService: ConfigService,
): MikroOrmModuleOptions {
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
    entities: ["./dist/community/entities/*.entity.js"],
    entitiesTs: ["./src/community/entities/*.entity.ts"],
  };
}
