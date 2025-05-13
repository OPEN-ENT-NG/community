import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CommunityService } from "./community.service";
import { CommunityController } from "./community.controller";
import { CoreModule } from "@core/index";
import { Community } from "./entities/community.entity";
import { CommonModule } from "@app/common/common.module";
import { InvitationModule } from "@app/invitation/invitation.module";
import { CommunityMapper } from "./community.mapper";
import { MembershipModule } from "@app/membership/membership.module";
import { CommunityStats } from "./entities/community-stats.entity";
import { CommunityActivityStats } from "./entities/community-activity-stats.entity";
import { DirectoryIntegrationService } from "./directory-integration.service";

@Module({
  imports: [
    CoreModule,
    MikroOrmModule.forFeature([
      Community,
      CommunityStats,
      CommunityActivityStats,
    ]),
    CommonModule,
    InvitationModule,
    MembershipModule,
  ],
  providers: [CommunityService, CommunityMapper, DirectoryIntegrationService],
  exports: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
