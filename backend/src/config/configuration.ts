import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
const version = require("../package.json").version;

const YAML_CONFIG_FILENAME = "../config.yaml";

export default () => {
  const conf = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf8"),
  ) as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  conf.version = version;
  return conf;
};
