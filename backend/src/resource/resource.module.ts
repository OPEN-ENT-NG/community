import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ResourceService } from "./resource.service";
import { ResourceController } from "./resource.controller";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([])],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
