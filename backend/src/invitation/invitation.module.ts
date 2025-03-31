import { Module } from "@nestjs/common";
import { LoggerModule } from "src/logger/logger.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([])],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
