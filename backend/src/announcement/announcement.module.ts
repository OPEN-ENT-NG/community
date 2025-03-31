import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([])],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
