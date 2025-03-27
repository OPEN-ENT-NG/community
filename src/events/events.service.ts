import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventDto } from './dto/event.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {

  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy
  ) {
    console.log('Creating events service')
  }

  /**
   * Send an event and do not wait for a reply.
   * @param event Event to send
   */

  /**
   * Send an event and do not wait for a reply.
   * @param address Address to which the event should be sent
   * @param event Event to send
   */
  async sendEvent<T>(event: EventDto<T>, address?: string) {
    const eventAddress = address || `${event.issuer}.${event.type}`;
    this.natsClient.emit(eventAddress, event);
  }

  /**
   * Send an event and wait for a reply.
   * @param event 
   * @returns 
   */
  async request<T, J>(event: EventDto<T>, address?: string): Promise<EventDto<J>> {
    const eventAddress = address || `${event.issuer}.${event.type}`;
    const reply = await firstValueFrom(this.natsClient.send(eventAddress, event));
    return reply as EventDto<J>;
  }
}
