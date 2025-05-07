import { Injectable } from "@nestjs/common";
import { CommunityResponseDto } from "@edifice.io/community-client-rest";
import { Community } from "./entities/community.entity";

@Injectable()
export class CommunityMapper {
  /**
   * Maps a Community entity to its DTO representation
   * @param community The Community entity to map
   * @returns CommunityResponseDto
   */
  toResponseDto(community: Community): CommunityResponseDto {
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
    };
  }
}
