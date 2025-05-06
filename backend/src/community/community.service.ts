import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Transactional } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { Logger } from "nestjs-pino";
import { v4 as uuidv4 } from "uuid";

import { Community, CommunityType } from "./entities/community.entity";
import {
  CreateCommunityDto,
  CommunityResponseDto,
} from "@edifice.io/community-client-rest";
import { UserService } from "@app/common/users.service";
import { InvitationService } from "@app/invitation/invitation.service";
import { ENTUserSession } from "@app/core";

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: EntityRepository<Community>,
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly natsClient: EntNatsServiceClient,
    private readonly logger: Logger,
  ) {}

  @Transactional()
  async createCommunity(
    createCommunityDto: CreateCommunityDto,
    session: ENTUserSession,
  ): Promise<CommunityResponseDto> {
    try {
      // Get current user from UserService
      const currentUser = await this.userService.getCurrentUser(session);

      // Create the community
      const community = this.communityRepository.create({
        title: createCommunityDto.title,
        image: createCommunityDto.image,
        type: createCommunityDto.type as CommunityType,
        creationDate: new Date(),
        discussionEnabled: createCommunityDto.discussionEnabled ?? true,
        secretCode: this.generateSecretCode(),
        schoolYearStart: createCommunityDto.schoolYearStart,
        schoolYearEnd: createCommunityDto.schoolYearEnd,
        welcomeNote: createCommunityDto.welcomeNote,
        creator: currentUser,
      });

      await this.communityRepository.upsert(community);

      // Use InvitationService to handle invitations
      if ((createCommunityDto.invitations?.userIds?.length ?? 0) > 0) {
        await this.invitationService.createInvitations(
          community,
          createCommunityDto.invitations!.userIds,
          currentUser,
        );
      }

      // Create the directory group
      await this.createDirectoryGroup(community);

      return this.mapToResponseDto(community);
    } catch (error) {
      this.logger.error(`Error creating community: `, error);
      throw new InternalServerErrorException(
        "community.create.directory.error",
      );
    }
  }

  private async createDirectoryGroup(community: Community): Promise<void> {
    try {
      // Call the NATS service to create a group in the directory
      const response = await this.natsClient.directoryGroupManualCreate({
        externalId: community.id.toString(),
        name: community.title,
      });

      if (!response.id) {
        throw new Error("community.create.directory.error");
      }

      this.logger.log(
        `Directory group created successfully for community ${community.id}`,
      );
    } catch (error) {
      this.logger.error(`Error creating directory group: `, error);
      throw new InternalServerErrorException(
        "community.create.directory.error",
      );
    }
  }

  private generateSecretCode(): string {
    // Generate a random UUID and take the first 8 characters
    return uuidv4().substring(0, 8).toUpperCase();
  }

  private mapToResponseDto(community: Community): CommunityResponseDto {
    return {
      id: Number(community.id),
      title: community.title,
      image: community.image,
      type: community.type,
      creationDate: community.creationDate,
      updateDate: community.updateDate,
      archivedDate: community.archivedDate,
      discussionEnabled: community.discussionEnabled,
      welcomeNote: community.welcomeNote,
      schoolYearStart: community.schoolYearStart,
      schoolYearEnd: community.schoolYearEnd,
      archiver: community.archiver
        ? {
            id: community.archiver?.entId,
            displayName: community.archiver?.displayName ?? "",
          }
        : undefined,
      creator: {
        id: community.creator.entId,
        displayName: community.creator.displayName ?? "",
      },
      modifier: community.modifier
        ? {
            id: community.modifier?.entId,
            displayName: community.modifier?.displayName ?? "",
          }
        : undefined,
      getSecretCode: () => null,
    };
  }
}
