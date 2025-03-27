import { EventDto } from "./dto/event.dto";

export class EventBuilder<Type> {
  private type: string;
  private payload: Type;
  private version: string = "1.0";
  
  withType(type: string): EventBuilder<Type> {
    this.type = type;
    return this;
  }
  
  withPayload(payload: Type): EventBuilder<Type> {
    this.payload = payload;
    return this;
  }
  
  withVersion(version: string): EventBuilder<Type> {
    this.version = version;
    return this;
  }

  build(): EventDto<Type> {
    return {
        issuer: 'community',
        type: this.type,
        version: this.version,
        createdAt: new Date(),
        payload: this.payload
    }
  }
}