import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsUrl,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  IsDate,
} from "class-validator";
import { UserDto } from "./community";
import { PaginationQueryDto } from "./base";

export enum ResourceType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  SOUND = "SOUND",
  ENT = "ENT",
  EXTERNAL_LINK = "EXTERNAL_LINK",
}

export class ResourceDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ResourceType })
  type: ResourceType;

  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  addedDate: Date;

  @ApiPropertyOptional()
  openInNewTab?: boolean;

  @ApiPropertyOptional()
  appName?: string;

  @ApiProperty()
  author: UserDto;

  @ApiProperty()
  communityId: number;

  @ApiPropertyOptional({ type: [Number] })
  folderIds?: number[];
}

export class CountResourceDto {
  @ApiProperty()
  count: number;
}

export class CreateResourceDto {
  @ApiProperty({
    description: "Resource type",
    enum: ResourceType,
    example: ResourceType.EXTERNAL_LINK,
  })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({
    description: "Resource URL",
    example: "https://example.com/resource",
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: "Resource title",
    example: "Interesting Article",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: "Whether to open in new tab (for links)",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean = true;

  @ApiPropertyOptional({
    description: "Application name (for ENT resources)",
  })
  @IsOptional()
  @IsString()
  appName?: string;

  @ApiPropertyOptional({
    description: "Folder IDs to add this resource to",
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  folderIds?: number[];
}

export class SearchResourceDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter by resource type",
    enum: ResourceType,
  })
  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @ApiPropertyOptional({
    description: "Filter resources added after this date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  addedAfter?: Date;
}