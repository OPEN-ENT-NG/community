import { Controller, Get, HttpException, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { ScrapbookService } from './scrapbook.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchScrapbookRequestDto } from './dto/scrapbook-search-request.dto';

@ApiTags('Scrapbooks')
@Controller('/api/scrapbook')
export class ScrapbookController {

    constructor(private readonly scrapbookService: ScrapbookService) {}


    @Get()
    @ApiResponse({ 
      status: 200, 
      description: 'List of scrapbooks with optional fields' 
    })
    async findAll(
      @Query(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      })) query: SearchScrapbookRequestDto
    ) {
      // Validate pagination parameters
      if (query.page < 1 || query.size < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }
  
      // Parse fields into a Set, handling undefined and empty string
      /*const fields: Set<string> = fieldsParam 
        ? new Set(fieldsParam.split(',').map(field => field.trim()))
        : new Set();*/
  
      try {
        // Fetch scrapbooks with optional field inclusion
        const { data, total } = await this.scrapbookService.search(
          query
        );
  
        // Prepare response with pagination metadata
        return {
          data,
          meta: {
            page: query.page,
            size: query.size,
            total,
            totalPages: Math.ceil(total / query.size)
          }
        };
      } catch (error) {
        throw new HttpException(
          'Failed to retrieve scrapbooks', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
}
