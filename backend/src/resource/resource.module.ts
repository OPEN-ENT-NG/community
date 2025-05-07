import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { ResourceService } from "./resource.service";
import { ResourceController } from "./resource.controller";

@Module({
  imports: [CoreModule],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
