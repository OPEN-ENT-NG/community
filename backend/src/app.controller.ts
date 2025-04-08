import { join } from "path";
import { readFileSync } from "fs";
import { Controller, Get, OnModuleInit, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { getStaticAssetsPath } from "./config/helpers";

@Controller()
export class AppController implements OnModuleInit {
  
  private indexHtmlContent: string;
  
  constructor(private readonly appService: AppService) {}
  
  onModuleInit() {
    // Read the file at startup and cache its content
    const indexPath = join(getStaticAssetsPath(), "..", "index.html");
    this.indexHtmlContent = readFileSync(indexPath, 'utf8');
  }
  
  @Get()
  @ApiExcludeEndpoint()
  serveIndexHtml(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }
}
