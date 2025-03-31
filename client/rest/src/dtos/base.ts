import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number (zero-indexed)',
    default: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiProperty({
    description: 'Number of items per page',
    default: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 20;
}


export class PageMetadataDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class PageDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  meta: PageMetadataDto;
}

export class FieldSelectionDto {
  @ApiProperty({
    description: 'Comma-separated list of fields to include in the response',
    example: 'id,title,type',
    required: false,
  })
  @IsOptional()
  @IsString()
  fields?: string;
}