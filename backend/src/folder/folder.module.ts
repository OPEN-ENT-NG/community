import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";

@Module({
  imports: [CoreModule],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
