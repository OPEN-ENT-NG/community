import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { DiscussionsService } from "./discussions.service";
import { DiscussionsController } from "./discussions.controller";

@Module({
  imports: [CoreModule],
  providers: [DiscussionsService],
  controllers: [DiscussionsController],
})
export class DiscussionsModule {}
