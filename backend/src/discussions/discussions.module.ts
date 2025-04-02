import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { DiscussionsService } from "./discussions.service";
import { DiscussionsController } from "./discussions.controller";

@Module({
  imports: [LoggerModule],
  providers: [DiscussionsService],
  controllers: [DiscussionsController],
})
export class DiscussionsModule {}
