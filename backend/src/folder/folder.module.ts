import { Module } from "@nestjs/common";
import { LoggerModule } from "@core/index";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";

@Module({
  imports: [LoggerModule],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
