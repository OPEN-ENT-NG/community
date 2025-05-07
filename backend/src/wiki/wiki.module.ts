import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { WikiService } from "./wiki.service";
import { WikiController } from "./wiki.controller";

@Module({
  imports: [CoreModule],
  providers: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {}
