import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { FolderService } from "./folder.service";
import { FolderController } from "./folder.controller";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([])],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
