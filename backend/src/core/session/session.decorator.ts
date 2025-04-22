import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ENTUserSession } from "@core/session/session.types";

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ENTUserSession => {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request?.raw.entSession;
  },
);
