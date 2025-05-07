import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { NestFactory } from "@nestjs/core";
import { v4 as uuidv4 } from "uuid";
import { Http2ServerRequest } from "http2";
import { IncomingMessage } from "http";

import { MigrationService } from "../database/migration.service";
import { setSwaggerConfig } from "../config/swagger.config";

export interface BootstrapOptions {
  globalPrefix?: string;
  globalPrefixExcludes?: string[];
  enableSwagger?: boolean;
  enableMigrations?: boolean;
  corsEnabled?: boolean;
}

/**
 * Creates and configures a NestJS application with standard settings
 */
export async function createApp(
  appModule: any,
  options: BootstrapOptions = {},
): Promise<NestFastifyApplication> {
  const defaultOptions: BootstrapOptions = {
    globalPrefixExcludes: ["public/*"],
    enableSwagger: true,
    enableMigrations: true,
    corsEnabled: true,
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // Create app with Fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    appModule,
    new FastifyAdapter({
      genReqId: (req: IncomingMessage | Http2ServerRequest) =>
        <string>req.headers["x-correlation-id"] || uuidv4(),
    }),
    {
      cors: mergedOptions.corsEnabled,
      bufferLogs: true,
    },
  );

  // Set global prefix if specified
  if (mergedOptions.globalPrefix) {
    app.setGlobalPrefix(mergedOptions.globalPrefix, {
      exclude: mergedOptions.globalPrefixExcludes,
    });
  }

  // Configure logger
  app.useLogger(app.get(Logger));
  const logger = app.get(Logger);

  // Configure validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const configService = app.get(ConfigService);
  const migrationService = app.get(MigrationService);
  // Set swagger config
  if (mergedOptions.enableSwagger) {
    setSwaggerConfig(app, configService);
  }

  // Run migrations if enabled
  if (mergedOptions.enableMigrations) {
    try {
      await migrationService.runMigrations();
    } catch (error) {
      logger.error("Migration error during startup:", error);
      process.exit(1);
    }
  }

  return app;
}

/**
 * Starts the application server with configured host and port
 */
export async function startApp(app: NestFastifyApplication): Promise<void> {
  const logger = app.get(Logger);
  const configService = app.get(ConfigService);

  logger.log("Launching app....");

  await app.listen(
    configService.get<number>("http.port", 3000),
    configService.get<string>("http.host", "0.0.0.0"),
  );

  logger.log(
    `✅ Application is running on: ${await app.getUrl()}`,
    "Bootstrap",
  );
}
