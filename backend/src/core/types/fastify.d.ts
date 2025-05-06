import { ENTUserSession } from "../session";

declare module "http" {
  interface IncomingMessage {
    entSession?: ENTUserSession; // Add your custom property
  }
}
