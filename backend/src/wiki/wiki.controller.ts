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
import { WikiService } from "./wiki.service";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { CountWikiPagesDto } from "@edifice.io/community-client-rest";

@ApiTags("Wikis")
@Controller("api/communities/:communityId/wikis")
export class WikiController {
  constructor(private readonly WikiService: WikiService) {}

  @Get("count")
  @ApiOperation({
    summary: "Count wiki pages modified after a specific date",
  })
  @ApiParam({ name: "communityId", description: "Community ID" })
  @ApiQuery({
    name: "afterDate",
    required: false,
    description: "Count wiki pages modified after this date",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Number of pages modified after the specified date",
    type: CountWikiPagesDto,
  })
  async count(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Query("publishedAfter", new ValidationPipe({ transform: true }))
    publishedAfter?: Date,
  ): Promise<CountWikiPagesDto> {
    throw new Error("Not implemented");
  }
}
