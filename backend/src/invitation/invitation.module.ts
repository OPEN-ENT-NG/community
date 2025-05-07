import { Module } from "@nestjs/common";
import { CoreModule } from "@core/index";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";
import { Invitation } from "./entities/invitation.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CommonModule } from "@app/common/common.module";

@Module({
  imports: [CoreModule, CommonModule, MikroOrmModule.forFeature([Invitation])],
  providers: [InvitationService],
  controllers: [InvitationController],
  exports: [InvitationService],
})
export class InvitationModule {}
