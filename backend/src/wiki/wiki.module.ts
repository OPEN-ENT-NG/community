import { Module } from "@nestjs/common";
import { LoggerModule } from "@core/index";
import { WikiService } from "./wiki.service";
import { WikiController } from "./wiki.controller";

@Module({
  imports: [LoggerModule],
  providers: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {}
