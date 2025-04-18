import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  NatsOptions,
} from "@nestjs/microservices";

export const NATS_CLIENT = "NATS_CLIENT";

export const NatsClientProvider: Provider = {
  provide: NATS_CLIENT,
  useFactory: (configService: ConfigService): ClientProxy => {
    // Créer les options en utilisant le type spécifique NatsOptions
    const options: NatsOptions = {
      transport: Transport.NATS,
      options: {
        servers: [
          configService.get<string>("nats.url", "nats://localhost:4222"),
        ],
        user: configService.get<string>("nats.user"),
        pass: configService.get<string>("nats.pass"),
        token: configService.get<string>("nats.token"),
      },
    };

    return ClientProxyFactory.create(options);
  },
  inject: [ConfigService],
};
