//TODO remove eslint-disable comments
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateInvitationDto,
  InvitationResponseDto,
  InvitationStatsDto,
  PageDto,
  SearchInvitationDto,
  UpdateInvitationStatusDto,
} from "@edifice.io/community-client-rest";
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
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { InvitationService } from "./invitation.service";

@ApiTags("Invitations")
@Controller("api/invitations")
@ApiBearerAuth()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  @ApiOperation({ summary: "List invitations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of invitations with pagination",
    type: PageDto,
  })
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: SearchInvitationDto,
  ): Promise<PageDto<InvitationResponseDto>> {
    throw new Error("Not implemented");
  }

  @Post()
  @ApiOperation({ summary: "Create invitations" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Invitations created successfully",
    type: [InvitationResponseDto],
  })
  async create(
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<InvitationResponseDto[]> {
    throw new Error("Not implemented");
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Accept or reject an invitation" })
  @ApiParam({ name: "id", description: "Invitation ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Invitation status updated",
    type: InvitationResponseDto,
  })
  async updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateInvitationStatusDto: UpdateInvitationStatusDto,
  ): Promise<InvitationResponseDto> {
    throw new Error("Not implemented");
  }

  @Get("count")
  @ApiOperation({ summary: "Count invitations sent after a specific date" })
  @ApiQuery({
    name: "communityId",
    required: false,
    description: "Community ID",
  })
  @ApiQuery({
    name: "sentAfter",
    required: true,
    description: "Date to count invitations sent after (ISO format)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Invitation count",
    schema: {
      properties: {
        count: { type: "number" },
      },
    },
  })
  async countAfterDate(
    @Query("communityId") communityId?: number,
    @Query("sentAfter") sentAfter?: Date,
  ): Promise<{ count: number }> {
    throw new Error("Not implemented");
  }

  @Get("stats")
  @ApiOperation({ summary: "Get invitation statistics" })
  @ApiQuery({
    name: "communityId",
    required: false,
    description: "Community ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Invitation statistics",
    type: InvitationStatsDto,
  })
  async getStats(
    @Query("communityId") communityId?: number,
  ): Promise<InvitationStatsDto> {
    throw new Error("Not implemented");
  }
}
