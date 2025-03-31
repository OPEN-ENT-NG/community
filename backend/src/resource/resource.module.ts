import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { ResourceService } from "./resource.service";
import { ResourceController } from "./resource.controller";

@Module({
  imports: [LoggerModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
