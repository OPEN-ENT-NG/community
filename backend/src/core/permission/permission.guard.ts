import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "./permission.decorator";
import { FastifyRequest } from "fastify";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string | false>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredPermission === undefined) {
      throw new UnauthorizedException("Permission not defined");
    }

    if (requiredPermission === false) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = request?.raw.entSession;

    if (!session) {
      throw new UnauthorizedException("No session found");
    }
    if (session.superAdmin) {
      return true; // Super admin has all permissions
    }

    const authorizedActions = session.authorizedActions || [];
    const hasPermission = authorizedActions.some(
      (action) => action.name === requiredPermission,
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        `Missing required permission: ${requiredPermission}`,
      );
    }

    return true;
  }
}
