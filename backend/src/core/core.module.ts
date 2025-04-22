import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";

import configuration from "./config/configuration";
import { createLoggerOptions } from "./config/logging.config";
import { getStaticAssetsPath } from "./utils/static-assets.utils";
import { LoggerModule } from "./logger/logger.module";
import { SessionMiddleware } from "./session/session.middleware";
import { DatabaseModule } from "./database/database.module";
import { FrontendController } from "./frontend.controller";
import { NatsModule } from "./nats";

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Pino logger
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createLoggerOptions,
    }),

    // Database module
    DatabaseModule,

    // NATS client module
    NatsModule,

    // Static files - with exclude patterns for API and wildcard routes
    ServeStaticModule.forRoot({
      rootPath: getStaticAssetsPath(),
      serveRoot: "/public",
      exclude: ["/api*"],
    }),

    // Our custom logger module
    LoggerModule,
  ],
  controllers: [FrontendController],
  providers: [],
  exports: [
    ConfigModule,
    PinoLoggerModule,
    DatabaseModule,
    LoggerModule,
    NatsModule,
  ],
})
export class CoreModule {
  // Utility method to configure session middleware
  static configureSessionMiddleware(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: "openapi", method: RequestMethod.GET },
        { path: "openapi-json", method: RequestMethod.GET },
        { path: "openapi/*", method: RequestMethod.GET },
      )
      .forRoutes("/api/*");
  }
}

//TODO export into another package @edifice.io/nestjs-core
