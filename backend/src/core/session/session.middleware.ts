import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage } from "http";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { ENTUserBookPersonReponse, ENTUserSession } from "./session.types";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  entBaseUrl: string;

  constructor(
    configService: ConfigService,
    @InjectPinoLogger(SessionMiddleware.name)
    private readonly logger: PinoLogger,
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
    const oneSessionId =
      this.getOnSessionIdFromHeaders(req) ||
      <string>req.headers["oneSessionId"];

    if (!oneSessionId) {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "not.authenticated" }));
      return;
    }

    // Fetch the session
    const session = await this.getSessionById(oneSessionId);

    if (session) {
      this.setSession(session, req);
      next();
    } else {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "invalid.session" }));
    }
  }

  setSession(session: ENTUserSession, req: IncomingMessage) {
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

  private async getSessionById(
    sessionId: string,
  ): Promise<ENTUserSession | undefined> {
    const headers = {
      Cookie: `oneSessionId=${sessionId}`,
    };
    let session: ENTUserSession | undefined;
    try {
      const response = await fetch(`${this.entBaseUrl}/auth/oauth2/userinfo`, {
        method: "GET",
        redirect: "manual",
        headers,
      });
      if (response.ok) {
        const apiPersonResponse =
          (await response.json()) as ENTUserBookPersonReponse;
        if (apiPersonResponse) {
          session = {
            userId: apiPersonResponse.userId,
            email: apiPersonResponse.email,
            login: apiPersonResponse.login,
            username: apiPersonResponse.username,
          };
        }
      } else {
        this.logger.warn("Could not fetch session : " + response.status);
      }
    } catch (error) {
      this.logger.warn(
        "An error occurred while fetching oneSessionId : " + error,
      );
    }
    return session;
  }
}
