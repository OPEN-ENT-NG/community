import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { WikiService } from "./wiki.service";
import { WikiController } from "./wiki.controller";

@Module({
  imports: [LoggerModule],
  providers: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {}
