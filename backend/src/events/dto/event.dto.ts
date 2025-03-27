
/**
 * Basic event.
 */
export type EventDto<Type> = {
  createdAt: Date;
  issuer: string;
  type: string;
  payload: Type;
  version: string;
}