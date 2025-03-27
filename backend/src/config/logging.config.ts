import { ConfigService } from "@nestjs/config";
import { Params } from "nestjs-pino";

export const createLoggerOptions = (configService: ConfigService): Params => {
  const logLevel = configService.get<string>("log.level", "info");

  // Prepare logging configuration
  const loggerConfig: any = {
    level: logLevel,
    transports: [],
  };

  // Console transport with pretty formatting
  const consoleTransport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname", // Remove pid and hostname from console output
      messageFormat: "{msg}", // Simplify message format
    },
  };

  // If no log path, use only console transport
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  loggerConfig.transport = {
    target: "pino-pretty",
    options: consoleTransport.options,
  };
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    pinoHttp: loggerConfig,
  };
};
