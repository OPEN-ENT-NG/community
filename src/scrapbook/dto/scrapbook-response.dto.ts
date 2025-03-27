import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  ValidateNested, 
  IsArray 
} from 'class-validator';
import { Type } from 'class-transformer';
import { OwnerDto } from './owner.dto';
import { SharedGroupDto } from './shared-group.dto';
import { PageResponseDto } from './page-response.dto';

export class ScrapbookResponseDto {
  @ApiProperty({ description: 'Unique identifier of the scrapbook' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Title of the scrapbook' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Name of the scrapbook' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Icon of the scrapbook', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'Trashed status' })
  @IsNumber()
  @IsOptional()
  trashed?: number;

  @ApiProperty({ description: 'Owner of the scrapbook' })
  @ValidateNested()
  @Type(() => OwnerDto)
  owner: OwnerDto;

  @ApiProperty({ 
    description: 'Shared groups', 
    type: [SharedGroupDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SharedGroupDto)
  @IsOptional()
  shared?: SharedGroupDto[];

  @ApiProperty({ 
    description: 'Pages of the scrapbook', 
    type: [PageResponseDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageResponseDto)
  @IsOptional()
  pages?: PageResponseDto[];

  @ApiProperty({ description: 'Version of the scrapbook', required: false })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiProperty({ description: 'Ingest job state', required: false })
  @IsString()
  @IsOptional()
  ingest_job_state?: string;
}