import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  NatsOptions,
} from "@nestjs/microservices";
import { SafeNatsDeserializer } from "./safe-nats.deserializer";
import { Logger } from "nestjs-pino";

export const NATS_CLIENT = "NATS_CLIENT";

export const NatsClientProvider: Provider = {
  provide: NATS_CLIENT,
  useFactory: (configService: ConfigService, logger: Logger): ClientProxy => {
    // Create options using the specific NatsOptions type
    const options: NatsOptions = {
      transport: Transport.NATS,
      options: {
        servers: [
          configService.get<string>("nats.url", "nats://localhost:4222"),
        ],
        user: configService.get<string>("nats.user"),
        pass: configService.get<string>("nats.pass"),
        token: configService.get<string>("nats.token"),
        // Add reconnect options for better reliability
        reconnect: true,
        reconnectTimeWait: 2000,
        maxReconnectAttempts: 10,
        // Add error handling for parsing
        preserveBuffers: true,
        deserializer: new SafeNatsDeserializer(logger),
      },
    };

    const client = ClientProxyFactory.create(options);
    return client;
  },
  inject: [ConfigService, Logger],
};
