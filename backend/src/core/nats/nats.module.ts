import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NatsClientProvider, NATS_CLIENT } from "./nats-client.provider";

@Module({
  imports: [ConfigModule],
  providers: [NatsClientProvider],
  exports: [NATS_CLIENT],
})
export class NatsModule {}
