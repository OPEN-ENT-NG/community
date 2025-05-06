import { join } from "path";
import { readFileSync, readdirSync } from "fs";
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
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { ClientProxy } from "@nestjs/microservices";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import { NATS_CLIENT } from "./nats";

/**
 * Controller responsible for serving the frontend application
 * Handles all routes that don't match API or static file patterns
 */
@Controller()
export class FrontendController implements OnModuleInit {
  private indexHtmlContent: string;
  private readonly natsClient: EntNatsServiceClient;
  private appName: string;
  constructor(
    @Inject() private readonly config: ConfigService,
    @Inject() private readonly logger: Logger,
    @Inject(NATS_CLIENT) readonly clientProxy: ClientProxy,
  ) {
    // Initialize the NATS client for communication with the backend
    this.natsClient = new EntNatsServiceClient(clientProxy, "portal");
  }
  async onModuleInit() {
    // Read the frontend index file at startup and cache its content
    const indexPath = join(getStaticAssetsPath(), "..", "index.html");
    this.indexHtmlContent = readFileSync(indexPath, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (this.appName = this.config.get("appName") as string),
      // Register i18n translations
      await this.registerApplicationTranslations();
  }

  /**
   * Loads i18n translation files and registers them with the i18n service
   */
  private async registerApplicationTranslations(): Promise<void> {
    try {
      const i18nPath = join(process.cwd(), "assets", "i18n");
      const i18nFiles = readdirSync(i18nPath).filter((file) =>
        file.endsWith(".json"),
      );

      const translationsByLanguage: Record<string, Record<string, string>> = {};
      // Load each language file
      for (const file of i18nFiles) {
        const fileContent = readFileSync(join(i18nPath, file), "utf8");
        const translations = JSON.parse(fileContent) as Record<string, string>;
        translationsByLanguage[file] = translations;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.natsClient.i18nByApplicationRegister({
        application: this.appName,
        translationsByLanguage,
      });

      this.logger.log(
        `Successfully registered ${Object.keys(translationsByLanguage).length} language files`,
      );
    } catch (error) {
      console.error("Failed to register i18n translations:", error);
    }
  }

  @Get("i18n")
  @ApiExcludeEndpoint()
  async translations(
    @Req() request: FastifyRequest,
  ): Promise<Record<string, string>> {
    // Convert the request headers to a format suitable for the NATS client
    const formattedHeaders: Record<string, string> = {};

    // Transform the headers from a flat structure to a nested one
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        formattedHeaders[key] = <string>value;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = await this.natsClient.i18nByApplicationFetch({
      headers: formattedHeaders,
      application: this.appName,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (result.translations ?? {}) as Record<string, string>;
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
