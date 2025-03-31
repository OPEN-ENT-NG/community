import { Controller, Get, Query } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { RequestLogger } from "src/logger/request-logger.service";
import { ApiResponse } from "@nestjs/swagger";

@Controller("/api/community")
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly logger: RequestLogger,
  ) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: "List of communities with optional fields",
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
  ) {
}
