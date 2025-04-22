import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
const packagePath = join(process.cwd(), "package.json");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
const version = require(packagePath).version;

export default () => {
  const YAML_CONFIG_FILENAME = join(process.cwd(), "config.yaml");
  const conf = yaml.load(readFileSync(YAML_CONFIG_FILENAME, "utf8")) as Record<
    string,
    any
  >;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  conf.version = version;
  return conf;
};
