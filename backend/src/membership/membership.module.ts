import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { LoggerModule } from "@core/index";
import { MembershipController } from "./membership.controller";

@Module({
  imports: [LoggerModule],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
