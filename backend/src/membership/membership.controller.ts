//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateMembershipBatchDto,
  CreateMembershipDto,
  JoinCommunityDto,
  LeaveCommunityOptionsDto,
  MembershipResponseDto,
  PageDto,
  PaginationQueryDto,
  SearchMembershipResponseDto,
  UpdateMembershipDto,
} from "@edifice.io/community-client-rest";
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { MembershipService } from "./membership.service";

@ApiTags("Memberships")
@Controller("api")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get("communities/:communityId/members")
  @ApiOperation({ summary: "List members of a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of members with pagination",
    type: () => SearchMembershipResponseDto,
  })
  async findByCommunity(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: PaginationQueryDto,
  ): Promise<PageDto<SearchMembershipResponseDto>> {
    throw new Error("Not implemented");
  }

  @Post("communities/:communityId/members")
  @ApiOperation({ summary: "Add a member to a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Member added successfully",
    type: MembershipResponseDto,
  })
  async addMember(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() createMembershipDto: CreateMembershipDto,
  ): Promise<MembershipResponseDto> {
    throw new Error("Not implemented");
  }

  @Post("communities/:communityId/members/batch")
  @ApiOperation({ summary: "Add multiple members to a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Members added successfully",
    type: [MembershipResponseDto],
  })
  async addMembers(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() createMembershipsDto: CreateMembershipBatchDto,
  ): Promise<MembershipResponseDto[]> {
    throw new Error("Not implemented");
  }

  @Post("communities/join")
  @ApiOperation({
    summary: "Join a community using secret code",
    description: "Creates a membership in the community using the secret code",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Joined community successfully",
    type: MembershipResponseDto,
  })
  async joinCommunity(
    @Body() joinCommunityDto: JoinCommunityDto,
  ): Promise<MembershipResponseDto> {
    throw new Error("Not implemented");
  }

  @Patch("communities/:communityId/members/:userId")
  @ApiOperation({ summary: "Update a member role" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Member updated successfully",
    type: MembershipResponseDto,
  })
  async updateMember(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("userId", ParseIntPipe) userId: number,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ): Promise<MembershipResponseDto> {
    throw new Error("Not implemented");
  }

  @Delete("communities/:communityId/members/:userId")
  @ApiOperation({ summary: "Remove a member from a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Member removed successfully",
  })
  async removeMember(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }

  @Post("communities/:communityId/leave")
  @ApiOperation({
    summary: "Leave a community",
    description: "Current user leaves the community",
  })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Left community successfully",
  })
  async leaveCommunity(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() options: LeaveCommunityOptionsDto,
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
