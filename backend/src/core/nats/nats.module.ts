import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NatsClientProvider, NATS_CLIENT } from "./nats-client.provider";
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { ClientProxy } from "@nestjs/microservices";

@Module({
  imports: [ConfigModule],
  providers: [
    NatsClientProvider,
    {
      provide: EntNatsServiceClient,
      useFactory: (clientProxy: ClientProxy) => {
        return new EntNatsServiceClient(clientProxy, "portal");
      },
      inject: ["NATS_CLIENT"],
    },
  ],
  exports: [NATS_CLIENT, EntNatsServiceClient],
})
export class NatsModule {}
