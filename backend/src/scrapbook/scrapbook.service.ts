import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Page, Scrapbook } from './scrapbook.schema';
import { Model } from 'mongoose';
import { validate } from 'class-validator';
import { ScrapbookResponseDto } from './dto/scrapbook-response.dto';
import { plainToInstance } from 'class-transformer';
import { PageResponseDto } from './dto/page-response.dto';
import { SearchScrapbookRequestDto } from './dto/scrapbook-search-request.dto';
import { RequestLogger } from 'src/logger/request-logger.service';

@Injectable()
export class ScrapbookService {
  private logger: RequestLogger;
  constructor(
    private readonly l: RequestLogger,
    @InjectModel(Scrapbook.name) private scrapbookModel: Model<Scrapbook>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
  ) {
    this.logger = l.child({context: ScrapbookService.name})
  }

  async search(query: SearchScrapbookRequestDto) {
    this.logger.info("Searching for scrapbooks")
    const page = query.page;
    const limit = query.size;
    const fields = query.fields;
    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Base query for scrapbooks
    const baseQuery = this.scrapbookModel
      .find()
      .sort({ created: -1 }) // Sort by creation date
      .skip(skip)
      .limit(limit);

    // Concurrent queries for scrapbooks and total count
    const [scrapbooks, total] = await Promise.all([
      baseQuery.exec(),
      this.scrapbookModel.countDocuments(),
    ]);

    // Process scrapbooks and convert to DTOs
    const processedScrapbooks = await Promise.all(
      scrapbooks.map(async (scrapbook) => {
        // Convert to plain object to work with class-transformer
        const scrapbookObject = scrapbook.toObject();
        let pagesDtos;
        // Conditionally add fields
        if (fields && fields.includes('pages')) {
          const pages = await this.pageModel
            .find({ scrapbook: scrapbook._id })
            .exec();

          // Convert pages to DTOs
          pagesDtos = plainToInstance(PageResponseDto, pages, {
            excludeExtraneousValues: true,
          });

          // Validate DTOs
          await Promise.all(
            pagesDtos.map(async (pageDto) => {
              const errors = await validate(pageDto);
              if (errors.length > 0) {
                throw new HttpException(
                  `Validation failed for page: ${errors.toString()}`,
                  HttpStatus.UNPROCESSABLE_ENTITY,
                );
              }
            }),
          );
        }

        // Convert scrapbook to DTO
        const scrapbookDto = plainToInstance(
          ScrapbookResponseDto,
          scrapbookObject
        );

        // Validate DTO
        const errors = await validate(scrapbookDto);
        if (errors.length > 0) {
          this.logger.warn(`${scrapbookDto._id} has errors : ${errors}`)
          throw new HttpException(
            `Validation failed for scrapbook: ${errors.toString()}`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        scrapbookDto.pages = pagesDtos;
        return scrapbookDto;
      }),
    );

    return {
      data: processedScrapbooks,
      total,
    };
  }
}
