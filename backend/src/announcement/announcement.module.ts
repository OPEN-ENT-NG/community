import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementController } from "./announcement.controller";

@Module({
  imports: [CoreModule],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
