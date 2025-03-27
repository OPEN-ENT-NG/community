
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
const version = require('../package.json').version;

const YAML_CONFIG_FILENAME = '../config.yaml';

export default () => {
  const conf = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
  conf.version = version;
  return conf;
};