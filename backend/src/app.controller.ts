import { join } from "path";
import { createReadStream } from "fs";
import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { getStaticAssetsPath } from "./config/helpers";

// Todo : optimiser avec memory plutôt que createReadStream
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @ApiExcludeEndpoint()
  serveIndexHtml(@Res() res: FastifyReply): void {
    const stream = createReadStream(
      join(getStaticAssetsPath(), "..", "index.html"),
    );
    res.type("text/html").send(stream);
  }
}
