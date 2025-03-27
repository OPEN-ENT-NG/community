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
import { AuthorDto } from './author.dto';
import { LayerDto } from './layer.dto';

export class PageResponseDto {
  @ApiProperty({ description: 'Unique identifier of the page' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Reference to the scrapbook' })
  @IsString()
  @IsNotEmpty()
  scrapbook: string;

  @ApiProperty({ description: 'Author of the page' })
  @ValidateNested()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @ApiProperty({ description: 'Version of the page', required: false })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiProperty({ description: 'Background', nullable: true, required: false })
  @IsString()
  @IsOptional()
  background?: string | null;

  @ApiProperty({ description: 'Background color', nullable: true, required: false })
  @IsString()
  @IsOptional()
  backgroundColor?: string | null;

  @ApiProperty({ 
    description: 'Layers of the page', 
    type: [LayerDto],
    required: false 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayerDto)
  @IsOptional()
  layers?: LayerDto[];
}