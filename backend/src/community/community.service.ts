import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from "@nestjs/common";
import { Transactional } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { Logger } from "nestjs-pino";
import { v4 as uuidv4 } from "uuid";

import { Community, CommunityType } from "./entities/community.entity";
import {
  CreateCommunityDto,
  CommunityResponseDto,
  SearchCommunityRequestDto,
  SearchCommunityResponseDto,
  CommunitySecretCodeDto,
  UpdateCommunityDto,
  CommunityStatsDto,
} from "@edifice.io/community-client-rest";
import { UserService } from "@app/common/users.service";
import { InvitationService } from "@app/invitation/invitation.service";
import { MembershipService } from "@app/membership/membership.service";
import { MembershipRole } from "@app/membership/entities/membership.entity";
import { ENTUserSession } from "@app/core";
import { CommunityMapper } from "./community.mapper";
import { CommunityStats } from "./entities/community-stats.entity";
import { CommunityActivityStats } from "./entities/community-activity-stats.entity";

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: EntityRepository<Community>,
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly membershipService: MembershipService,
    private readonly natsClient: EntNatsServiceClient,
    private readonly logger: Logger,
    private readonly communityMapper: CommunityMapper,
    private readonly em: EntityManager,
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
      // use persistAndFlush to generate auto-incremented ID
      await this.communityRepository
        .getEntityManager()
        .persistAndFlush(community);

      // Add creator as admin member of the community
      await this.membershipService.createMembership({
        community: community,
        user: currentUser,
        role: MembershipRole.ADMIN,
      });

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

      return this.communityMapper.toResponseDto(community);
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

  /**
   * Finds communities where the current user is a member
   * @param query Search parameters including pagination, filtering and sorting options
   * @param session Current user session
   * @returns Paginated list of communities
   */
  async findCommunitiesByMembership(
    query: SearchCommunityRequestDto,
    session: ENTUserSession,
  ): Promise<SearchCommunityResponseDto> {
    try {
      // Get the current user
      const currentUser = await this.userService.getCurrentUser(session);

      // Build the base query
      const qb = this.communityRepository.createQueryBuilder("c");

      // Join the membership table to filter by user
      qb.leftJoin("c.memberships", "m").where({ "m.user": currentUser.id });

      // Apply title search filter (if present)
      if (query.title) {
        qb.andWhere({ "c.title": { $ilike: `%${query.title}%` } });
      }

      // Apply community type filter (if present)
      if (query.type) {
        qb.andWhere({ "c.type": query.type });
      }

      // Apply creation date filter (if present)
      if (query.createdAfter) {
        qb.andWhere({ "c.creationDate": { $gte: query.createdAfter } });
      }

      // Apply school year filter (if present)
      if (query.schoolYear) {
        qb.andWhere({
          $or: [
            { "c.schoolYearStart": query.schoolYear },
            { "c.schoolYearEnd": query.schoolYear },
          ],
        });
      }
      // Apply sorting (default to newest first)
      qb.orderBy({ "c.creationDate": "DESC" });

      // Apply pagination
      if (query.page && query.size) {
        qb.offset((query.page - 1) * query.size).limit(query.size);
      }

      // Execute the query
      const [communities, total] = await qb.getResultAndCount();

      // Map the results to DTOs
      const communityDtos = communities.map((community) =>
        this.communityMapper.toResponseDto(community),
      );

      // Build the response following the DTO structure
      return {
        communities: communityDtos,
        total,
      };
    } catch (error) {
      this.logger.error(`Error searching communities by membership: `, error);
      throw new InternalServerErrorException("community.search.error");
    }
  }

  /**
   * Finds a community by ID and verifies user membership
   * @param id Community ID
   * @param fields Optional comma-separated list of fields to include
   * @returns Community details
   */
  async findCommunityById(id: number): Promise<CommunityResponseDto> {
    try {
      // Find community with membership check
      const community = await this.communityRepository.findOne({ id });

      if (!community) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }

      // Return the community data
      return this.communityMapper.toResponseDto(community);
    } catch (error) {
      this.logger.error(`Error finding community by ID: ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.get.error");
    }
  }

  /**
   * Get the secret code of a community
   * Only accessible by community admins
   * @param id Community ID
   * @returns Secret code DTO
   */
  async getSecretCode(id: number): Promise<CommunitySecretCodeDto> {
    try {
      // Note: The role check is already handled by the @RequireCommunityRole decorator
      // This method will only be called if the user is an admin

      // Find the community
      const community = await this.communityRepository.findOne({ id });

      if (!community) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }

      // Return the secret code
      return {
        id: Number(community.id),
        secretCode: community.secretCode!,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving secret code for community ${id}:`,
        error,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.secretCode.error");
    }
  }

  /**
   * Update a community
   * @param id Community ID
   * @param updateCommunityDto Data to update
   * @param session User session
   * @returns Updated community
   */
  @Transactional()
  async updateCommunity(
    id: number,
    updateCommunityDto: UpdateCommunityDto,
    session: ENTUserSession,
  ): Promise<CommunityResponseDto> {
    try {
      // Get current user
      const currentUser = await this.userService.getCurrentUser(session);

      // Find the community
      const community = await this.communityRepository.findOne({ id });
      if (!community) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }

      // Update community properties
      if (updateCommunityDto.title !== undefined) {
        community.title = updateCommunityDto.title;
      }

      if (updateCommunityDto.image !== undefined) {
        community.image = updateCommunityDto.image;
      }

      if (updateCommunityDto.discussionEnabled !== undefined) {
        community.discussionEnabled = updateCommunityDto.discussionEnabled;
      }

      if (updateCommunityDto.welcomeNote !== undefined) {
        community.welcomeNote = updateCommunityDto.welcomeNote;
      }

      if (updateCommunityDto.schoolYearStart !== undefined) {
        community.schoolYearStart = updateCommunityDto.schoolYearStart;
      }

      if (updateCommunityDto.schoolYearEnd !== undefined) {
        community.schoolYearEnd = updateCommunityDto.schoolYearEnd;
      }

      // Set the update metadata
      community.updateDate = new Date();
      community.modifier = currentUser;

      // Save the changes
      await this.communityRepository.getEntityManager().flush();

      // Update the directory group if title has changed
      if (updateCommunityDto.title !== undefined) {
        await this.updateDirectoryGroup(community);
      }

      // Return the updated community
      return this.communityMapper.toResponseDto(community);
    } catch (error) {
      this.logger.error(`Error updating community ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.update.error");
    }
  }

  /**
   * Update a directory group for a community
   * @param community Community to update the directory group for
   */
  private async updateDirectoryGroup(community: Community): Promise<void> {
    try {
      // Call the NATS service to update the group in the directory
      await this.natsClient.directoryGroupManualUpdate({
        externalId: community.id.toString(),
        name: community.title,
      });
    } catch (error) {
      this.logger.error(
        `Error updating directory group for community ${community.id}:`,
        error,
      );
      throw new InternalServerErrorException(
        "community.update.directory.error",
      );
    }
  }

  /**
   * Delete a community with cascade delete for related entities
   * @param id Community ID to delete
   * @param session User session
   */
  @Transactional()
  async deleteCommunity(id: number): Promise<void> {
    try {
      // Find the community
      const community = await this.communityRepository.findOne({ id });
      if (!community) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }

      // First delete the directory group (this must be done before the DB delete)
      await this.deleteDirectoryGroup(community);

      // Now just delete the community and PostgreSQL will handle cascade deletes
      await this.communityRepository
        .getEntityManager()
        .removeAndFlush(community);

      this.logger.log(`Community ${id} has been deleted with all related data`);
    } catch (error) {
      console.error(`Error deleting community ${id}:`, error);
      this.logger.error(`Error deleting community ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.delete.error");
    }
  }

  /**
   * Delete a directory group for a community
   * @param community Community to delete the directory group for
   */
  private async deleteDirectoryGroup(community: Community): Promise<void> {
    try {
      // Call the NATS service to delete the group from directory
      await this.natsClient.directoryGroupManualDelete({
        externalId: community.id.toString(),
      });
    } catch (error) {
      this.logger.error(
        `Error deleting directory group for community ${community.id}:`,
        error,
      );
      // Non-blocking error, we just log it
    }
  }

  /**
   * Get statistics for a community
   * @param id Community ID
   * @returns Community statistics
   */
  async getCommunityStats(id: number): Promise<CommunityStatsDto> {
    try {
      // Find the community for basic info
      const community = await this.communityRepository.findOne({ id });
      if (!community) {
        throw new NotFoundException(`Community with ID ${id} not found`);
      }

      // Refresh the materialized views to get up-to-date data
      await this.refreshMaterializedViews();

      // Get membership stats from community_stats
      const membershipStats = await this.em.findOne(CommunityStats, {
        communityId: id,
      });

      // Get activity stats from community_activity_stats
      const activityStats = await this.em.findOne(CommunityActivityStats, {
        communityId: id,
      });

      // Return combined stats
      return {
        ...membershipStats,
        ...activityStats,
        acceptedAdmins: membershipStats?.acceptedAdmins ?? 0,
        acceptedMembers: membershipStats?.acceptedMembers ?? 0,
        totalAdmins: membershipStats?.totalAdmins ?? 0,
        totalMembers: membershipStats?.totalMembers ?? 0,
      };
    } catch (error) {
      this.logger.error(`Error getting stats for community ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.stats.error");
    }
  }

  /**
   * Refresh the materialized views
   */
  private async refreshMaterializedViews(): Promise<void> {
    try {
      // In production, you might want to implement a more selective refresh strategy
      // e.g., only refresh views that haven't been refreshed in the last hour
      await this.em.execute(`
        REFRESH MATERIALIZED VIEW community.community_stats;
        REFRESH MATERIALIZED VIEW community.community_activity_stats;
      `);
    } catch (error) {
      this.logger.warn(`Could not refresh materialized views:}`, error);
      // Non-blocking error, we'll use potentially stale data
    }
  }
}
