
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ENTUserSession } from 'src/common/session.types';

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ENTUserSession => {
    const request = ctx.switchToHttp().getRequest();
    return (<any>request)?.raw.entSession;
  },
);
