import { ConfigService } from "@nestjs/config";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setSwaggerConfig(
  app: NestFastifyApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle("@edifice.io/community-backend")
    .setDescription(`API description of community backend`)
    .setVersion(<string>configService.get("version"))
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("openapi", app, documentFactory);
}
