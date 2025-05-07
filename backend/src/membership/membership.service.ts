import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { PinoLogger } from "nestjs-pino";
import { Transactional } from "@mikro-orm/core";

import { Membership, MembershipRole } from "./entities/membership.entity";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: EntityRepository<Membership>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MembershipService.name);
  }

  /**
   * Create a new membership for a user in a community
   * @param params Object containing communityId, userId and role
   * @returns The created membership entity
   */
  @Transactional()
  async createMembership(params: {
    community: Community;
    user: Users;
    role: MembershipRole;
  }): Promise<Membership> {
    try {
      // Create new membership
      const membership = this.membershipRepository.create({
        community: params.community,
        user: params.user,
        role: params.role,
        joinDate: new Date(),
      });

      // Persist to database
      await this.membershipRepository.upsert(membership);

      this.logger.debug(
        `Created membership for user ${params.user.id} in community ${params.community.id} with role ${params.role}`,
      );

      return membership;
    } catch (error) {
      this.logger.error(`Error creating membership: `, error);
      throw new InternalServerErrorException("membership.create.error");
    }
  }

  /**
   * Find a membership by user ID and community ID
   * @param userId User ID to check
   * @param communityId Community ID to check
   * @returns Membership object if found, null otherwise
   */
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
