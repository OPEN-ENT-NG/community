//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
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
  CreateCommunityDto,
  SearchCommunityRequestDto,
  SearchCommunityResponseDto,
  UpdateCommunityDto,
} from "@edifice.io/community-client-rest";

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
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: SearchCommunityRequestDto,
  ): Promise<SearchCommunityResponseDto> {
    throw new Error("Not implemented");
  }

  @Post()
  @ApiOperation({ summary: "Create a new community" })
  @ApiResponse({
    status: 201,
    description: "Community created successfully",
    type: CommunityResponseDto,
  })
  async create(
    @Body() createCommunityDto: CreateCommunityDto,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
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
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Query("fields") fields?: string,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
  }

  @Get(":id/secret-code")
  @ApiOperation({ summary: "Get community secret code" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Secret code retrieved (only for admins)",
    type: CommunityResponseDto,
  })
  @SerializeOptions({ groups: ["admin", "secretCode"] })
  async getSecretCode(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a community" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Community updated",
    type: CommunityResponseDto,
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a community" })
  @ApiParam({ name: "id", description: "Community ID" })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Community deleted",
  })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    throw new Error("Not implemented");
  }

  @Patch(":id/welcome-note")
  @ApiOperation({ summary: "Update welcome note" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Welcome note updated",
    type: CommunityResponseDto,
  })
  async updateWelcomeNote(
    @Param("id", ParseIntPipe) id: number,
    @Body("welcomeNote") welcomeNote: string,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get community statistics" })
  @ApiParam({ name: "id", description: "Community ID" })
  @ApiResponse({
    status: 200,
    description: "Community statistics",
    type: CommunityResponseDto,
  })
  async getStats(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CommunityResponseDto> {
    throw new Error("Not implemented");
  }
}
