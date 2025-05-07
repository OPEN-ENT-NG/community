import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { CoreModule } from "@core/index";
import { Users } from "@app/common/entities/users.entity";
import { UserService } from "./users.service";
import { CommunityRoleGuard } from "./community-role.guard";
import { APP_GUARD } from "@nestjs/core";
import { Membership } from "@app/membership/entities/membership.entity";

@Module({
  imports: [CoreModule, MikroOrmModule.forFeature([Users, Membership])],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: CommunityRoleGuard,
    },
  ],
  controllers: [],
  exports: [UserService],
})
export class CommonModule {}
