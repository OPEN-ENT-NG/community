import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setSwaggerConfig(
  app: NestFastifyApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle("edfifice-nestjs-boilerplate")
    .setDescription("API description of edfifice-nestjs-boilerplate")
    .setVersion(<string>configService.get("version"))
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("openapi", app, documentFactory);
}
