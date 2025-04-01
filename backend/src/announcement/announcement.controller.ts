//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AnnouncementService } from "./announcement.service";
import {
  AnnouncementDto,
  CountAnnouncementDto,
  CreateAnnouncementDto,
  SearchAnnouncementDto,
  UpdateAnnouncementDto,
} from "@edifice.io/community-client-rest";

@ApiTags("Announcements")
@Controller("api/communities/:communityId/announcements")
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  @ApiOperation({ summary: "List announcements for a community" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of announcements with pagination",
    type: [AnnouncementDto],
  })
  async findAll(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query(new ValidationPipe({ transform: true }))
    query: SearchAnnouncementDto,
  ): Promise<{ items: AnnouncementDto[]; meta: any }> {
    throw new Error("Not implemented");
  }

  @Post()
  @ApiOperation({ summary: "Create an announcement" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Announcement created successfully",
    type: AnnouncementDto,
  })
  async create(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDto> {
    throw new Error("Not implemented");
  }

  @Get("count")
  @ApiOperation({
    summary: "Count announcements published after a specific date",
  })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiQuery({
    name: "publishedAfter",
    required: false,
    description: "Count announcements published after this date",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Number of announcements published after the specified date",
    type: CountAnnouncementDto,
  })
  async count(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query("publishedAfter", new ValidationPipe({ transform: true }))
    publishedAfter?: Date,
  ): Promise<CountAnnouncementDto> {
    throw new Error("Not implemented");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an announcement by ID" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Announcement found",
    type: AnnouncementDto,
  })
  async findOne(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<AnnouncementDto> {
    throw new Error("Not implemented");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an announcement" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Announcement updated",
    type: AnnouncementDto,
  })
  async update(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementDto> {
    throw new Error("Not implemented");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an announcement" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiParam({ name: "id", description: "Announcement ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Announcement deleted",
  })
  async remove(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
