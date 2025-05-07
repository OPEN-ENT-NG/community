import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { COMMUNITY_ROLE_KEY, CommunityRole } from "./community-role.decorator";
import {
  Membership,
  MembershipRole,
} from "@app/membership/entities/membership.entity";
import { UserService } from "@app/common/users.service";
import { FastifyRequest } from "fastify";
import { EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";

@Injectable()
export class CommunityRoleGuard implements CanActivate {
  private readonly logger = new Logger(CommunityRoleGuard.name);

  constructor(
    private reflector: Reflector,
    private userService: UserService,
    @InjectRepository(Membership)
    private readonly membershipRepository: EntityRepository<Membership>,
  ) {}

  /**
   * Checks if the current user has the required role for the community
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the required role(s) from the handler metadata
    const requiredRoles = this.reflector.get<CommunityRole | CommunityRole[]>(
      COMMUNITY_ROLE_KEY,
      context.getHandler(),
    );

    if (requiredRoles === undefined) {
      throw new ForbiddenException("Community role required for this endpoint");
    }

    if (requiredRoles === "SKIP") {
      return true;
    }

    // Get request and session
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const session = request?.raw?.entSession;

    if (!session) {
      this.logger.debug("No session found");
      throw new UnauthorizedException("No user session found");
    }

    const user = await this.userService.getCurrentUser(session);
    if (!user) {
      this.logger.debug("No user found in session");
      throw new UnauthorizedException("No user found in session");
    }

    // Get community ID from request parameters
    const params = request.params as { id: string };
    const communityId = parseInt(params.id, 10);
    if (!communityId) {
      this.logger.warn("Community ID parameter missing or invalid");
      throw new ForbiddenException("Invalid community ID");
    }

    // Super admin bypass for all restrictions
    if (session.superAdmin) {
      this.logger.debug(
        `Super admin access granted to community ${communityId}`,
      );
      return true;
    }

    try {
      // Find the user's membership in this community
      const membership = await this.findMembershipByUserAndCommunity(
        Number(user.id),
        communityId,
      );

      // User is not a member of this community
      if (!membership) {
        this.logger.debug(
          `User ${session.userId} is not a member of community ${communityId}`,
        );
        throw new ForbiddenException("You are not a member of this community");
      }

      // Convert to array if a single role was provided
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      // Check if user's role satisfies any of the required roles
      const hasRequiredRole = roles.some((requiredRole) => {
        if (requiredRole === "ADMIN") {
          return membership.role === MembershipRole.ADMIN;
        }
        if (requiredRole === "MEMBER") {
          return (
            membership.role === MembershipRole.MEMBER ||
            membership.role === MembershipRole.ADMIN
          );
        }
        return false;
      });

      if (!hasRequiredRole) {
        this.logger.debug(
          `User ${session.userId} does not have required role for community ${communityId}`,
        );
        throw new ForbiddenException(
          "You do not have the required role in this community",
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error("Error checking community role", error);
      return false; // Default to deny on error
    }
  }
  async findMembershipByUserAndCommunity(
    userId: number,
    communityId: number,
  ): Promise<Membership | null> {
    try {
      const membership = await this.membershipRepository.findOne({
        user: { id: userId },
        community: { id: communityId },
      });

      return membership;
    } catch (error) {
      this.logger.error(
        `Error finding membership for user ${userId} in community ${communityId}:`,
        error,
      );
      return null;
    }
  }
}
