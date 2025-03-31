import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";

@Module({
  imports: [LoggerModule],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
