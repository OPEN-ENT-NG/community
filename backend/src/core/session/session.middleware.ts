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
    private readonly natsClient: EntNatsServiceClient,
  ) {
    this.entBaseUrl = configService.get<string>(
      "ent.baseUrl",
      "http://localhost:8090",
    );
  }

  async use(
    req: FastifyRequest["raw"],
    res: FastifyReply["raw"],
    next: () => void,
  ) {
    try {
      const session = await this.natsClient.sessionFind({
        cookies: req.headers.cookie,
      });
      if (session?.session) {
        this.setSession(session.session, req);
        next();
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "invalid.session" }));
      }
    } catch (e) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: e.message,
        }),
      );
    }
  }

  setSession(session: SessionDto, req: IncomingMessage) {
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
