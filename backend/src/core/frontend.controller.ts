import { join } from "path";
import { readFileSync } from "fs";
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Req,
  Res,
} from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";
import { getStaticAssetsPath } from "./utils/static-assets.utils";
import {
  EntNatsServiceClient,
  FetchTranslationsResponseDTO
} from "@edifice.io/edifice-ent-client";

/**
 * Controller responsible for serving the frontend application
 * Handles all routes that don't match API or static file patterns
 */
@Controller()
export class FrontendController implements OnModuleInit {
  private indexHtmlContent: string;
  constructor(@Inject() private readonly natsClient: EntNatsServiceClient) {}
  onModuleInit() {
    // Read the frontend index file at startup and cache its content
    const indexPath = join(getStaticAssetsPath(), "..", "index.html");
    this.indexHtmlContent = readFileSync(indexPath, "utf8");
  }

  @Get("i18n")
  @ApiExcludeEndpoint()
  async translations(
    @Req() request: FastifyRequest,
  ): Promise<FetchTranslationsResponseDTO> {
    // Convert the request headers to a format suitable for the NATS client
    const formattedHeaders: Record<string, string> = {};

    // Transform the headers from a flat structure to a nested one
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        formattedHeaders[key] = <string>value;
      }
    });

    const result = await this.natsClient.i18nTranslationsFetch({
      headers: formattedHeaders,
    });
    return result;
  }

  /**
   * Root path handler
   */
  @Get("")
  @ApiExcludeEndpoint()
  serveRoot(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }

  /**
   * Catch-all route handler for all other paths
   * This single route will handle both single-level and nested paths
   */
  @Get("*")
  @ApiExcludeEndpoint()
  serveWildcard(@Res() res: FastifyReply): void {
    res.type("text/html").send(this.indexHtmlContent);
  }
}
