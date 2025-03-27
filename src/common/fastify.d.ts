import { IncomingMessage } from 'http';
import { ENTUserSession } from './session.types';

declare module 'http' {
  interface IncomingMessage {
    entSession?: ENTUserSession; // Add your custom property
  }
}