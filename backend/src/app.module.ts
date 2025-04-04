import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createLoggerOptions } from "./config/logging.config";
import configuration from "./config/configuration";
//import mongo from "./config/mongo";
//import { MongooseModule } from "@nestjs/mongoose";
import { SessionMiddleware } from "./session/session.middleware";
import { RequestLogger } from "./logger/request-logger.service";
import { LoggerModule as MyLoggerModule } from "./logger/logger.module";
import { CommunityModule } from "./community/community.module";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { createPostgresOptions } from "./config/postgres.config";
import { FolderModule } from "./folder/folder.module";
import { AnnouncementModule } from "./announcement/announcement.module";
import { InvitationModule } from "./invitation/invitation.module";
import { MembershipModule } from "./membership/membership.module";
import { ResourceModule } from "./resource/resource.module";
import { WikiModule } from "./wiki/wiki.module";
import { DiscussionsModule } from "./discussions/discussions.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createLoggerOptions,
    }),
    /*MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongo,
    }),*/
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createPostgresOptions,
      driver: PostgreSqlDriver,
    }),
    MyLoggerModule,
    AnnouncementModule,
    CommunityModule,
    DiscussionsModule,
    FolderModule,
    InvitationModule,
    MembershipModule,
    ResourceModule,
    WikiModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestLogger],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
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
