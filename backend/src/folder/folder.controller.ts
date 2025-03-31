//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
  HttpStatus,
  Delete,
  HttpCode,
  Patch,
} from "@nestjs/common";
import { FolderService } from "./folder.service";
import {
  FolderDto,
  SearchFolderDto,
  CreateFolderDto,
  FolderDetailDto,
  UpdateFolderDto,
} from "@edifice.io/community-client-rest";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@ApiTags("Folders")
@Controller("api/communities/:communityId/folders")
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  @ApiOperation({ summary: "List folders in a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of folders with pagination",
    type: FolderDto,
    isArray: true,
  })
  async findAll(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query(new ValidationPipe({ transform: true })) query: SearchFolderDto,
  ): Promise<{ items: FolderDto[]; meta: any }> {
    throw new Error("Not implemented");
  }

  @Get("roots")
  @ApiOperation({ summary: "Get root folders for a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of root folders",
    type: FolderDto,
    isArray: true,
  })
  async findRoots(
    @Param("communityId", ParseIntPipe) communityId: number,
  ): Promise<FolderDto[]> {
    throw new Error("Not implemented");
  }

  @Post()
  @ApiOperation({ summary: "Create a folder in a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Folder created successfully",
    type: FolderDto,
  })
  async create(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderDto> {
    throw new Error("Not implemented");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get folder details" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Folder ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Folder details",
    type: FolderDetailDto,
  })
  async findOne(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FolderDetailDto> {
    throw new Error("Not implemented");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a folder" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Folder ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Folder updated",
    type: FolderDto,
  })
  async update(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<FolderDto> {
    throw new Error("Not implemented");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a folder" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Folder ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Folder deleted",
  })
  async remove(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
