import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { mkdir } from 'node:fs/promises';
import * as path from 'node:path';

export const createLoggerOptions = async (
  configService: ConfigService
): Promise<Params> => {
    const logLevel = configService.get<string>('log.level', 'info');

    // Prepare logging configuration
    const loggerConfig: any = {
      level: logLevel,
      transports: []
    };

    // Console transport with pretty formatting
    const consoleTransport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname', // Remove pid and hostname from console output
        messageFormat: '{msg}', // Simplify message format
      }
    };

    // If no log path, use only console transport
    loggerConfig.transport = {
      target: 'pino-pretty',
      options: consoleTransport.options
    };
    return {
      pinoHttp: loggerConfig
    };
};