import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Transactional } from "@mikro-orm/core";
import { Community } from "../community/entities/community.entity";
import { Invitation, InvitationStatus } from "./entities/invitation.entity";
import { Users } from "../common/entities/users.entity";
import { UserService } from "../common/users.service";

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: EntityRepository<Invitation>,
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InvitationService.name);
  }

  /**
   * Creates invitations for multiple users to join a community
   * @param community The community to invite users to
   * @param userIds Array of user ENT IDs to invite
   * @param inviter The user sending the invitations
   * @returns Created invitation entities
   */
  @Transactional()
  async createInvitations(
    community: Community,
    userIds: string[],
    inviter: Users,
  ): Promise<Invitation[]> {
    if (!userIds.length) {
      return [];
    }

    // Get users by their IDs (reusing UserService)
    const userMap = await this.userService.findOrCreateUsersByEntIds(userIds);

    // Create invitation entities
    const now = new Date();
    const invitations: Invitation[] = userIds
      .filter((id) => userMap.has(id))
      .map((id) => {
        const user = userMap.get(id)!;
        return this.invitationRepository.create({
          invitationDate: now,
          modificationDate: now,
          status: InvitationStatus.PENDING,
          community,
          user,
          inviter,
        });
      });

    // Persist all invitations in a single operation
    if (invitations.length) {
      await this.invitationRepository.upsertMany(invitations);
      this.logger.info(
        `Created ${invitations.length} invitations for community ${community.id}`,
      );
    }

    return invitations;
  }
}
