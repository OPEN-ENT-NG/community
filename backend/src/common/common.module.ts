import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { LoggerModule } from "@core/index";
import { Users } from "@app/common/entities/users.entity";
import { NatsModule } from "@core/nats/nats.module";
import { UserService } from "./users.service";

@Module({
  imports: [LoggerModule, MikroOrmModule.forFeature([Users]), NatsModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class CommonModule {}
