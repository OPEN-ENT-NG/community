import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class SearchScrapbookRequestDto {
  @ApiProperty({ description: 'Unique identifier of the scrapbook', required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ description: 'Unique identifier of the scrapbook', required: false })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  ids?: string[];

  @ApiProperty({ description: 'Fields to return', required: false })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  fields?: string[];

  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => value || 1) // Default to 1 if not provided
  page: number = 1;

  @ApiProperty({ description: 'Number of items per page', default: 20, maximum: 100, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(100)
  @Transform(({ value }) => {
    if (!value) return 20; // Default value
    return Math.min(parseInt(value), 100); // Ensure max is 100
  })
  size: number = 20;
}
