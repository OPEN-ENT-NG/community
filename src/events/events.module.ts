import { Module } from '@nestjs/common';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemporalService } from './temporal.service';
import { ExportService } from './export.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: createNatsClient
      }
    ]),
  ],
  providers: [EventsService, ExportService, TemporalService],
  exports: [EventsService, TemporalService]
})
export class EventsModule {}

function createNatsClient(configService: ConfigService): ClientProvider | Promise<ClientProvider> {
  return {
    transport: Transport.NATS,
    options: {
      url: configService.get<string>('nats.url', 'nats://localhost:4222'),
      debug: configService.get<boolean>('nats.debug', false),
      encoding: 'utf-8'
    }
  }
}

