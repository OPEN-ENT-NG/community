//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
  HttpStatus,
} from "@nestjs/common";
import { DiscussionsService } from "./discussions.service";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import {
  CountDiscussionDto,
  CountDiscussionMessageDto,
} from "@edifice.io/community-client-rest";

@ApiTags("Discussionss")
@Controller("api/communities/:communityId/discussions")
export class DiscussionsController {
  constructor(private readonly DiscussionsService: DiscussionsService) {}
  @Get("count")
  @ApiOperation({ summary: "Count discussions added after a specific date" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Number of discussions",
    type: CountDiscussionDto,
  })
  async countDiscussionsAfterDate(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query("addedAfterDate") addedAfterDate: Date,
  ): Promise<CountDiscussionDto> {
    throw new Error("Not implemented");
  }

  @Get("messages/count")
  @ApiOperation({ summary: "Count messages posted after a specific date" })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Number of messages",
    type: CountDiscussionMessageDto,
  })
  async countMessagesAfterDate(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query("postedAfterDate") postedAfterDate: Date,
  ): Promise<CountDiscussionMessageDto> {
    throw new Error("Not implemented");
  }
}
