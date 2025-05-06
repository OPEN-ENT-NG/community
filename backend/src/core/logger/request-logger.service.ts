import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import pino, { ChildLoggerOptions } from "pino";
import { ENTUserSession } from "../session";

@Injectable({ scope: Scope.REQUEST }) // Make the logger request-scoped
export class RequestLogger {
  private logger: pino.Logger;

  constructor(@Inject(REQUEST) private readonly req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const session: ENTUserSession = (<any>req).raw.entSession;
    if (session) {
      // Create a child logger with contextual fields (e.g., userId)
      this.logger = pino().child({
        id: req.id,
        path: req.path,
        method: req.method,
        userId: session.userId,
      });
    } else {
      this.logger = pino();
    }
  }

  // Expose Pino's logging methods
  info(message: string, context?: Record<string, any>) {
    this.logger.info(context, message);
  }

  error(message: string, context?: Record<string, any>) {
    this.logger.error(context, message);
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn(context, message);
  }

  debug(message: string, context?: Record<string, any>) {
    this.logger.debug(context, message);
  }

  child<ChildCustomLevels extends string = never>(
    bindings: pino.Bindings,
    options?: ChildLoggerOptions<ChildCustomLevels>,
  ): RequestLogger {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return <any>this.logger.child(bindings, options);
  }
}
