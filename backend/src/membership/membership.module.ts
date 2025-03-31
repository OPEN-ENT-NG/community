import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { LoggerModule } from "src/logger/logger.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MembershipController } from "./membership.controller";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([])],
  providers: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
