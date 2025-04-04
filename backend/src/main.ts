import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { v4 as uuidv4 } from "uuid";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Http2ServerRequest } from "http2";
import { IncomingMessage } from "http";
import { ConfigService } from "@nestjs/config";
import { setSwaggerConfig } from "./config/swagger.config";
import { ValidationPipe } from "@nestjs/common";

import { join } from "path";
import fastifyStatic from "@fastify/static";
import { FastifyRequest, FastifyReply } from "fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (req: IncomingMessage | Http2ServerRequest) =>
        <string>req.headers["x-correlation-id"] || uuidv4(),
    }),
    {
      cors: true,
      bufferLogs: true,
    },
  );

  const configService = app.get(ConfigService);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  setSwaggerConfig(app, configService);

  // Path to frontend
  const frontendPath = join(__dirname, "..", "frontend-build");
  // Register via fastifyStatic
  await app.register(fastifyStatic, {
    root: frontendPath,
    prefix: "/static/",
    decorateReply: false,
  });
  const fastifyInstance = app.getHttpAdapter().getInstance();

  // Capture all requests except /api
  fastifyInstance.get(
    "/*",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.url.startsWith("/api")) {
        app.get(Logger).log(`Serving frontend for ${request.url}`, "Static");
        return reply.sendFile("index.html", frontendPath);
      }

      reply.status(404).send({ message: "Not Found" });
    },
  );

  const logger = app.get(Logger);
  logger.log("Launching app....");

  await app.listen(
    configService.get<number>("http.port", 3000),
    configService.get<string>("http.host", "0.0.0.0"),
  );
  logger.log(
    `✅ Application is running on: ${await app.getUrl()}`,
    "Bootstrap",
  );

  /*const natsUrl = configService.get<string>('nats.url', 'nats://localhost:4222');
  
  logger.log(`Connecting to ${natsUrl}...`)
  try {
    // Create a NATS microservice
    const natsMicroservice = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        queue: 'visibility-service',
        debug: configService.get<boolean>('nats.debug', false)
      },
    });

    // Start all microservices
    await app.startAllMicroservices();

    logger.log('✅ NATS microservice successfully started', 'NatsService');
  } catch (error) {
    logger.error(`An error occurred`, error.stack)
  }*/
}
bootstrap();
