//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ResourceDto,
  SearchResourceDto,
  CreateResourceDto,
  CountResourceDto,
} from "@edifice.io/community-client-rest";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { ResourceService } from "./resource.service";

@ApiTags("Resources")
@Controller("api/communities/:communityId/resources")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @ApiOperation({ summary: "List resources for a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of resources with pagination",
    type: [ResourceDto],
  })
  async findAll(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query(new ValidationPipe({ transform: true })) query: SearchResourceDto,
  ): Promise<{ items: ResourceDto[]; meta: any }> {
    throw new Error("Not implemented");
  }

  @Post()
  @ApiOperation({ summary: "Add a resource to a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Resource created successfully",
    type: ResourceDto,
  })
  async create(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<ResourceDto> {
    throw new Error("Not implemented");
  }

  @Get("count")
  @ApiOperation({ summary: "Count resources added after a specific date" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiQuery({
    name: "addedAfter",
    required: false,
    description: "Count resources added after this date",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Number of resources added after the specified date",
    type: CountResourceDto,
  })
  async count(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query("addedAfter", new ValidationPipe({ transform: true }))
    addedAfter?: Date,
  ): Promise<CountResourceDto> {
    throw new Error("Not implemented");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a resource by ID" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Resource ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Resource found",
    type: ResourceDto,
  })
  async findOne(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ResourceDto> {
    throw new Error("Not implemented");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove a resource from a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Resource ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Resource removed",
  })
  async remove(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }

  @Post(":id/folders/:folderId")
  @ApiOperation({ summary: "Add a resource to a folder" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Resource ID" })
  @ApiParam({ name: "folderId", description: "Folder ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Resource added to folder",
  })
  async addToFolder(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
    @Param("folderId", ParseIntPipe) folderId: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }

  @Delete(":id/folders/:folderId")
  @ApiOperation({ summary: "Remove a resource from a folder" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Resource ID" })
  @ApiParam({ name: "folderId", description: "Folder ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Resource removed from folder",
  })
  async removeFromFolder(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
    @Param("folderId", ParseIntPipe) folderId: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
