import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CoreModule } from "@core/index";
import { User } from "@app/common/entities/user.entity";
import { UserService } from "./user.service";
import { CommunityRoleGuard } from "./community-role.guard";
import { APP_GUARD } from "@nestjs/core";
import { Membership } from "@app/membership/entities/membership.entity";
import { DirectoryIntegrationService } from "./directory-integration.service";

@Module({
  imports: [CoreModule, MikroOrmModule.forFeature([User, Membership])],
  providers: [
    DirectoryIntegrationService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: CommunityRoleGuard,
    },
  ],
  controllers: [],
  exports: [UserService, DirectoryIntegrationService],
})
export class CommonModule {}
