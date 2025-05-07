import { SetMetadata } from "@nestjs/common";

export const COMMUNITY_ROLE_KEY = "required_community_role";

/**
 * Community role types
 */
export type CommunityRole = "ADMIN" | "MEMBER" | "SKIP";

/**
 * Decorator to specify what community role is required to access a resource
 * @param role Role or array of roles (any of which grants access)
 */
export const RequireCommunityRole = (role: CommunityRole | CommunityRole[]) =>
  SetMetadata(COMMUNITY_ROLE_KEY, role);
