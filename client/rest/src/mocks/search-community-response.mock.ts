import {
  CommunityResponseDto,
  CommunityStatsDto,
  CommunityType,
  SearchCommunityResponseDto,
  UserDto,
} from "../dtos";

/**
 * Creates a mock user with the given ID
 * @param id - User ID
 * @returns A mock UserDto
 */
export function createMockUser(id: number): UserDto {
  return {
    id,
    displayName: `User ${id}`,
  };
}

/**
 * Creates mock community statistics
 * @returns A mock CommunityStatsDto
 */
export function createMockCommunityStats(): CommunityStatsDto {
  return {
    totalMembers: Math.floor(Math.random() * 50) + 5,
    acceptedMembers: Math.floor(Math.random() * 40) + 3,
    totalAdmins: Math.floor(Math.random() * 3) + 1,
    acceptedAdmins: Math.floor(Math.random() * 3) + 1,
  };
}

/**
 * Creates a mock community with the given ID
 * @param id - Community ID
 * @returns A mock CommunityResponseDto
 */
export function createMockCommunity(id: number): CommunityResponseDto {
  const creator = createMockUser(Math.floor(Math.random() * 1000) + 1);
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);

  const communityType =
    Math.random() > 0.5 ? CommunityType.FREE : CommunityType.CLASS;

  // Initialize a base community response
  const community = new CommunityResponseDto();

  // Set all required properties
  community.id = id;
  community.title = `Community ${id}`;
  community.creationDate = lastMonth;
  community.updateDate = Math.random() > 0.7 ? now : undefined;
  community.type = communityType;
  community.discussionEnabled = Math.random() > 0.2;
  community.creator = creator;

  // Set optional properties
  if (communityType === CommunityType.CLASS) {
    const currentYear = new Date().getFullYear();
    community.schoolYearStart = currentYear;
    community.schoolYearEnd = currentYear + 1;
  }

  if (Math.random() > 0.7) {
    community.image = `https://picsum.photos/id/${(id % 100) + 100}/200/200`;
  }

  if (Math.random() > 0.5) {
    community.welcomeNote = `Welcome to Community ${id}! We're glad to have you here.`;
  }

  if (Math.random() > 0.8) {
    community.secretCode = `secret-${id}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;
  }

  if (Math.random() > 0.9) {
    const archiveDate = new Date(now);
    archiveDate.setDate(now.getDate() - 15);
    community.archivedDate = archiveDate;
    community.archiver = createMockUser(Math.floor(Math.random() * 1000) + 1);
  }

  if (Math.random() > 0.6) {
    community.modifier = createMockUser(Math.floor(Math.random() * 1000) + 1);
  }

  community.stats = createMockCommunityStats();

  return community;
}

/**
 * Creates a mock SearchCommunityResponseDto with the specified number of communities
 * @param count - Number of communities to include (default: 10)
 * @returns A mock SearchCommunityResponseDto
 */
export function createMockSearchCommunityResponse(
  count: number = 10
): SearchCommunityResponseDto {
  const communities = Array.from({ length: count }, (_, i) =>
    createMockCommunity(i + 1)
  );

  const response = new SearchCommunityResponseDto();
  response.communities = communities;
  response.total = communities.length + Math.floor(Math.random() * 20); // Total might be higher than page size

  return response;
}

/**
 * Mock data for community search response
 */
export const mockSearchCommunityResponse: SearchCommunityResponseDto =
  createMockSearchCommunityResponse();

/**
 * A larger dataset with more communities
 */
export const mockLargeSearchCommunityResponse: SearchCommunityResponseDto =
  createMockSearchCommunityResponse(50);

/**
 * An empty search response
 */
export const mockEmptySearchCommunityResponse: SearchCommunityResponseDto = {
  communities: [],
  total: 0,
};
