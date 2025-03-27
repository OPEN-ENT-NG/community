import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SearchCommunityRequestDto } from './dtos/search-community-request.dto';
import { CommunityService } from './community.service';
import { CreateCommunityRequestDto } from './dtos/create-community-request.dto';
import { CommunityDto } from './dtos/community.dto';
import { RequestLogger } from 'src/logger/request-logger.service';
import { SearchCommunityResponseDto } from './dtos/search-community-response.dto';
import { Session } from 'src/session/session.decorator';
import { ENTUserSession } from 'src/common/session.types';

@Controller('/api/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService,
    private readonly logger: RequestLogger
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of communities with optional fields',
    type: SearchCommunityResponseDto
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
    // Validate pagination parameters
    if (query.page < 1 || query.size < 1) {
      throw new HttpException(
        'Invalid pagination parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const { data, total } = await this.communityService.search(query);
      // Prepare response with pagination metadata
      return {
        data,
        meta: {
          page: query.page,
          size: query.size,
          total,
          totalPages: Math.ceil(total / query.size),
        },
      };
    } catch (error) {
      console.error(error)
      this.logger.error(error);
      throw new HttpException(
        'Failed to retrieve communities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: "The community has been successfully created",
    type: CommunityDto
  })
  async createCommunity(
    @Body() request: CreateCommunityRequestDto,
    @Session() session: ENTUserSession
  ): Promise<CommunityDto> {
    const community = await this.communityService.create(request, session);
    return community;
  }
}
