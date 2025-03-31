import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";

@Module({
  imports: [LoggerModule],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
