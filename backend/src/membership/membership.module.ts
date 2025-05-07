import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { CoreModule } from "@core/index";
import { MembershipController } from "./membership.controller";
import { CommonModule } from "@app/common/common.module";
import { Membership } from "./entities/membership.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [CoreModule, CommonModule, MikroOrmModule.forFeature([Membership])],
  providers: [MembershipService],
  controllers: [MembershipController],
  exports: [MembershipService],
})
export class MembershipModule {}
