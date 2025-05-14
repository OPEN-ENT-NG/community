import { ENTUserSession } from "../session";

declare module "http" {
  interface IncomingMessage {
    entSession?: ENTUserSession;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    entSession?: SessionDto;
  }
}