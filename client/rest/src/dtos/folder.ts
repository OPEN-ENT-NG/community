import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  IsBoolean,
} from "class-validator";
import { ResourceDto } from "./resource";
import { PaginationQueryDto } from "./base";
import { UserDto } from "./community";

export class FolderStatsDto {
  @ApiProperty({ description: "Number of child folders in this folder" })
  childCount: number;
}

export class FolderDto {
  @ApiProperty({ description: "Folder ID" })
  id: number;

  @ApiProperty({ description: "Folder name" })
  name: string;

  @ApiProperty({ description: "Creation date" })
  creationDate: Date;

  @ApiPropertyOptional({ description: "Last modification date" })
  modificationDate?: Date;

  @ApiProperty({ description: "Whether this is a root folder" })
  isRoot: boolean;

  @ApiProperty({ description: "User who created the folder" })
  creator: UserDto;

  @ApiPropertyOptional({ description: "User who last modified the folder" })
  modifier?: UserDto;

  @ApiPropertyOptional({ description: "Parent folder ID" })
  parentId?: number;

  @ApiProperty({ description: "Community ID" })
  communityId: number;

  @ApiPropertyOptional({ description: "Folder statistics" })
  stats?: FolderStatsDto;
}

export class FolderDetailDto extends FolderDto {
  @ApiPropertyOptional({ type: [FolderDto], description: "Subfolders" })
  subFolders?: FolderDto[];

  @ApiPropertyOptional({
    type: [ResourceDto],
    description: "Resources in this folder",
  })
  resources?: ResourceDto[];
}
export class CreateFolderDto {
  @ApiProperty({
    description: "Folder name",
    example: "Documents",
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: "Parent folder ID (null if root folder)",
    example: 123,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional({
    description: "Whether this is a root folder",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRoot?: boolean = false;
}
export class UpdateFolderDto {
  @ApiProperty({
    description: "Folder name",
    example: "Documents",
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: "Parent folder ID (null if root folder)",
    example: 123,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;
}

export class SearchFolderDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter by folder name (partial match)",
    example: "Documents",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Filter by parent folder ID",
    example: 123,
  })
  @IsOptional()
  @Type(() => Number)
  parentId?: number;

  @ApiPropertyOptional({
    description: "Get only root folders",
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  rootOnly?: boolean = false;
}
