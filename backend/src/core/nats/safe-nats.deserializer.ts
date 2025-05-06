import { Logger } from "nestjs-pino";
import { Deserializer } from "@nestjs/microservices";
import { NatsResponseJSONDeserializer } from "@nestjs/microservices/deserializers/nats-response-json.deserializer";

/**
 * A custom deserializer for NATS responses that handles non-JSON responses gracefully.
 * If the response is not valid JSON, it logs a warning and returns a default error object.
 */
export class SafeNatsDeserializer implements Deserializer {
  private readonly defaultDeserializer: NatsResponseJSONDeserializer;

  constructor(private readonly logger: Logger) {
    this.defaultDeserializer = new NatsResponseJSONDeserializer();
  }

  deserialize(value: any, options?: Record<string, any>): any {
    try {
      // Check if the value is a valid JSON string
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.defaultDeserializer.deserialize(value, options);
    } catch {
      // If the value is not valid JSON, log a warning and return a default error object
      const message = (value as string).toString();
      this.logger.warn(
        `Received non-JSON response from NATS: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
      );

      return {
        err: {
          message,
          name: "BAD_JSON",
          code: "BAD_JSON",
          status: 400,
        },
        response: null,
      };
    }
  }
}
