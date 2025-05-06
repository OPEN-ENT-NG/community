import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CommunityService } from "./community.service";
import { CommunityController } from "./community.controller";
import { LoggerModule } from "@core/index";
import { Community } from "./entities/community.entity";
import { NatsModule } from "@core/nats/nats.module";
import { CommonModule } from "@app/common/common.module";
import { InvitationModule } from "@app/invitation/invitation.module";

@Module({
  imports: [
    LoggerModule,
    MikroOrmModule.forFeature([Community]),
    NatsModule,
    CommonModule,
    InvitationModule,
  ],
  providers: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
