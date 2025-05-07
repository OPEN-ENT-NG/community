import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException,
  InternalServerErrorException,
  Req,
} from "@nestjs/common";
import { CommunityService } from "./community.service";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SerializeOptions } from "@nestjs/common";
import {
  CommunityResponseDto,
  CommunitySecretCodeDto,
  CommunityStatsDto,
  CreateCommunityDto,
  SearchCommunityRequestDto,
  SearchCommunityResponseDto,
  UpdateCommunityDto,
} from "@edifice.io/community-client-rest";
import { FastifyRequest } from "fastify";
import { RequirePermission } from "@app/core";
import { RequireCommunityRole } from "@app/common";

@ApiTags("Communities")
@Controller("api/communities")
@UseInterceptors(ClassSerializerInterceptor)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: "List communities" })
  @ApiResponse({
    status: 200,
    description: "List of communities with pagination",
    type: SearchCommunityResponseDto,
  })
  @RequirePermission("community.access")
  @RequireCommunityRole("SKIP")
  async findAll(
    @Req() request: FastifyRequest,
    @Query() query: SearchCommunityRequestDto,
  ): Promise<SearchCommunityResponseDto> {
    try {
      const session = request.raw.entSession;
      return await this.communityService.findCommunitiesByMembership(
        query,
        session!,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.search.error");
    }
  }

  @Post()
  @ApiOperation({ summary: "Create a new community" })
  @ApiResponse({
    status: 201,
    description: "Community created successfully",
    type: CommunityResponseDto,
  })
  @RequirePermission("community.create")
  @RequireCommunityRole("SKIP")
  async create(
    @Req() request: FastifyRequest,
    @Body() createCommunityDto: CreateCommunityDto,
  ): Promise<CommunityResponseDto> {
    try {
      const session = request.raw.entSession;
      return await this.communityService.createCommunity(
        createCommunityDto,
        session!,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.create.error");
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a community by ID" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiQuery({
    name: "fields",
    required: false,
    description: "Comma-separated field list",
  })
  @ApiResponse({
    status: 200,
    description: "Community found",
    type: CommunityResponseDto,
  })
  @SerializeOptions({ groups: ["default"] })
  @RequirePermission("community.access")
  @RequireCommunityRole("MEMBER")
  async findOne(
    @Req() request: FastifyRequest,
    @Param("id", ParseIntPipe) id: number,
    @Query("fields") _fields?: string,
  ): Promise<CommunityResponseDto> {
    try {
      return await this.communityService.findCommunityById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.get.error");
    }
  }

  @Get(":id/secret-code")
  @ApiOperation({ summary: "Get community secret code" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Secret code retrieved (only for admins)",
    type: CommunitySecretCodeDto,
  })
  @SerializeOptions({ groups: ["admin", "secretCode"] })
  @RequirePermission("community.access")
  @RequireCommunityRole("ADMIN")
  async getSecretCode(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CommunitySecretCodeDto> {
    try {
      return await this.communityService.getSecretCode(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.secretCode.error");
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a community" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Community updated",
    type: CommunityResponseDto,
  })
  @RequirePermission("community.access")
  @RequireCommunityRole("ADMIN")
  async update(
    @Req() request: FastifyRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<CommunityResponseDto> {
    try {
      const session = request.raw.entSession;
      return await this.communityService.updateCommunity(
        id,
        updateCommunityDto,
        session!,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.update.error");
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a community" })
  @ApiParam({ name: "id", description: "Community ID" })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Community deleted",
  })
  @RequirePermission("community.access")
  @RequireCommunityRole("ADMIN")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    try {
      await this.communityService.deleteCommunity(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.delete.error");
    }
  }

  @Patch(":id/welcome-note")
  @ApiOperation({ summary: "Update welcome note" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Welcome note updated",
    type: CommunityResponseDto,
  })
  @RequirePermission("community.access")
  @RequireCommunityRole("ADMIN")
  async updateWelcomeNote(
    @Req() request: FastifyRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body("welcomeNote") welcomeNote: string,
  ): Promise<CommunityResponseDto> {
    try {
      const session = request.raw.entSession;
      // Reuse the existing updateCommunity method with just the welcomeNote
      return await this.communityService.updateCommunity(
        id,
        {
          welcomeNote,
          title: undefined!,
          type: undefined!,
          discussionEnabled: undefined!,
        }, // Pass only the welcomeNote property
        session!,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.welcomeNote.error");
    }
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get community statistics" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Community statistics",
    type: CommunityStatsDto,
  })
  @RequirePermission("community.access")
  @RequireCommunityRole("MEMBER")
  async getStats(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CommunityStatsDto> {
    try {
      return await this.communityService.getCommunityStats(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("community.stats.error");
    }
  }
}
