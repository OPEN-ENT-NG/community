import { Options } from "@mikro-orm/core";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { createPostgresOptions } from "./postgres.config";

const configPath = path.join(process.cwd(), "config.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8")) as any as Record<
  string,
  any
>;

export const mikroOrmConfig: Options = createPostgresOptions(
  new ConfigService(config),
);
