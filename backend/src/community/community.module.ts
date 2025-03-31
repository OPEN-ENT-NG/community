import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityController as CommunityController } from "./community.controller";
import { LoggerModule } from "src/logger/logger.module";

@Module({
  imports: [LoggerModule /*MikroOrmModule.forFeature([])*/],
  providers: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
