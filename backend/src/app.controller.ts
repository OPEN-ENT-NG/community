import { join } from "path";
import { readFileSync } from "fs";
import { Controller, Get, OnModuleInit, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply } from "fastify";
import { getStaticAssetsPath } from "./config/static-assets.helper";

@Controller()
export class AppController implements OnModuleInit {
  private indexHtmlContent: string;

  constructor(private readonly appService: AppService) {}

  onModuleInit() {
    // Read the file at startup and cache its content
    const indexPath = join(getStaticAssetsPath(), "..", "index.html");
    this.indexHtmlContent = readFileSync(indexPath, "utf8");
  }
  /**
   * Root path for the application
   */
  @Get()
  @ApiExcludeEndpoint()
  serveIndexHtml(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }
  /**
   * Display a specific community
   */
  @Get("id/:id")
  @ApiExcludeEndpoint()
  getCommunity(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Form step 1 for community creation - Type selection
   */
  @Get("create/type")
  @ApiExcludeEndpoint()
  getCreateType(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Form step 2 for community creation - Basic information
   */
  @Get("create/form")
  @ApiExcludeEndpoint()
  getCreateForm(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Form step 3 for community creation - Customization
   */
  @Get("create/custom")
  @ApiExcludeEndpoint()
  getCreateCustom(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Form step 4 for community creation - Member management
   */
  @Get("create/members")
  @ApiExcludeEndpoint()
  getCreateMembers(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Resources of a specific community
   */
  @Get("id/:id/resources")
  @ApiExcludeEndpoint()
  getCommunityResources(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Members of a specific community
   */
  @Get("id/:id/members")
  @ApiExcludeEndpoint()
  getCommunityMembers(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }
}
