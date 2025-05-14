import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage } from "http";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { SessionDto } from "@edifice.io/edifice-ent-client/dist/nats/ent-nats-service.types";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  entBaseUrl: string;

  constructor(
    configService: ConfigService,
    @InjectPinoLogger(SessionMiddleware.name)
    private readonly logger: PinoLogger,
    private readonly entServiceClient: EntNatsServiceClient,
  ) {
    this.entBaseUrl = configService.get<string>(
      "ent.baseUrl",
      "http://localhost:8090",
    );
  }

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: () => void,
  ) {
    try {
      // Extract query parameters from the URL
    // Extract query parameters directly from Fastify's parsed query
    const queryParams = req.query as Record<string, string>;
    
    // Convert request headers to a simple object format
    const headers: Record<string, string> = {};
    Object.keys(req.headers).forEach((key) => {
      // Handle potential array headers by taking the first value
      const headerValue = req.headers[key];
      headers[key] = Array.isArray(headerValue)
        ? headerValue[0]
        : (headerValue as string);
    });

    // Get the path directly from Fastify
    const pathPrefix = req.url.split("/")[0] || "";

    // Call the session service with all authentication data
    const session = await this.entServiceClient.sessionFind({
      cookies: req.headers.cookie,
      headers,
      params: queryParams,
      pathPrefix,
      path: req.url,
    });
      const urlObj = new URL(
        req.url || "",
        `http://${req.headers.host || "localhost"}`,
      );
      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      // Convert request headers to a simple object format
      const headers: Record<string, string> = {};
      Object.keys(req.headers).forEach((key) => {
        // Handle potential array headers by taking the first value
        const headerValue = req.headers[key];
        headers[key] = Array.isArray(headerValue)
          ? headerValue[0]
          : (headerValue as string);
      });

      // Determine the pathPrefix for OAuth scope verification
      // Use the first segment of the URL path
      const pathPrefix = urlObj.pathname.split("/")[0] || "";

      // Call the session service with all authentication data
      const session = await this.entServiceClient.sessionFind({
        cookies: req.headers.cookie,
        headers,
        params: queryParams,
        pathPrefix,
        path: urlObj.pathname,
      });

      if (session?.session) {
        this.setSession(session.session, req);
        next();
      } else {
        this.logger.debug("Session validation failed");
        res.statusCode = 401;
        res.send(JSON.stringify({ message: "invalid.session" }));
      }
    } catch (e) {
      this.logger.error("Session validation error", e);
      res.statusCode = 401;
      res.send(
        JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: e.message,
        }),
      );
    }
  }

  setSession(session: SessionDto, req: FastifyRequest) {
    req.entSession = session;
  }

  getOnSessionIdFromHeaders(req: IncomingMessage): string | undefined {
    const cookies = req.headers.cookie || "";
    if (cookies) {
      const parts = cookies.split(";");
      for (const cookie of parts) {
        const trimmed = cookie.trim();
        const cookieValue = trimmed.slice(trimmed.indexOf("=") + 1);
        if (trimmed.startsWith("oneSessionId")) {
          return cookieValue;
        }
      }
    }
  }
}
