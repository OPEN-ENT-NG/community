import { Module } from "@nestjs/common";
import { LoggerModule } from "@core/index";
import { DiscussionsService } from "./discussions.service";
import { DiscussionsController } from "./discussions.controller";

@Module({
  imports: [LoggerModule],
  providers: [DiscussionsService],
  controllers: [DiscussionsController],
})
export class DiscussionsModule {}
