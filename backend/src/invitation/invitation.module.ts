import { Module } from "@nestjs/common";
import { LoggerModule } from "@core/index";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

@Module({
  imports: [LoggerModule],
  providers: [InvitationService],
  controllers: [InvitationController],
})
export class InvitationModule {}
