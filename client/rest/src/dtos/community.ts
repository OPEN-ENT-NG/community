import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { FieldSelectionDto, PaginationQueryDto } from "./base";

export enum CommunityType {
  CLASS = "CLASS",
  FREE = "FREE",
}

export class InitialInvitationDto {
  @ApiProperty({
    description: "List of user IDs to invite",
    example: ["b9ea566a-c3d4-41ef-9806-65d6beb3bddb", "b9ea566a-c3d4-41ef-9806-65d6beb3bddc"],
  })
  @IsUUID(4, { each: true })
  userIds: string[];
}

export class CreateCommunityDto {
  @ApiPropertyOptional({ description: "Community illustration image" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: "Community title",
    maxLength: 80,
    example: "Math Class 2025",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string;

  @ApiProperty({
    description: "Community type",
    enum: CommunityType,
    example: CommunityType.CLASS,
  })
  @IsEnum(CommunityType)
  type: CommunityType;

  @ApiPropertyOptional({
    description: "School year start",
    example: 2025,
  })
  @IsOptional()
  @IsInt()
  schoolYearStart?: number;

  @ApiPropertyOptional({
    description: "School year end",
    example: 2026,
  })
  @IsOptional()
  @IsInt()
  schoolYearEnd?: number;

  @ApiPropertyOptional({
    description: "Welcome note",
    maxLength: 400,
    example: "Welcome to our math community!",
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  welcomeNote?: string;

  @ApiProperty({
    description: "Enable discussion features",
    default: true,
  })
  @IsBoolean()
  discussionEnabled: boolean = true;

  @ApiPropertyOptional({
    description: "Secret code to join the community",
    example: "MATH2025",
  })
  @IsOptional()
  @IsString()
  secretCode?: string;

  @ApiPropertyOptional({
    description: "Initial invitations to send",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InitialInvitationDto)
  invitations?: InitialInvitationDto;
}

export class UpdateCommunityDto {
  @ApiPropertyOptional({ description: "Community illustration image" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: "Community title",
    maxLength: 80,
    example: "Math Class 2025",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  title: string;

  @ApiProperty({
    description: "Community type",
    enum: CommunityType,
    example: CommunityType.CLASS,
  })
  @IsEnum(CommunityType)
  type: CommunityType;

  @ApiPropertyOptional({
    description: "School year start",
    example: 2025,
  })
  @IsOptional()
  @IsInt()
  schoolYearStart?: number;

  @ApiPropertyOptional({
    description: "School year end",
    example: 2026,
  })
  @IsOptional()
  @IsInt()
  schoolYearEnd?: number;

  @ApiPropertyOptional({
    description: "Welcome note",
    maxLength: 400,
    example: "Welcome to our math community!",
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  welcomeNote?: string;

  @ApiProperty({
    description: "Enable discussion features",
    default: true,
  })
  @IsBoolean()
  discussionEnabled: boolean = true;

  @ApiPropertyOptional({
    description: "Secret code to join the community",
    example: "MATH2025",
  })
  @IsOptional()
  @IsString()
  secretCode?: string;
}

export class SearchCommunityRequestDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter by community title (partial match)",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: "Filter by community type",
    enum: CommunityType,
  })
  @IsOptional()
  @IsEnum(CommunityType)
  type?: CommunityType;

  @ApiPropertyOptional({
    description: "Filter communities created after this date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAfter?: Date;

  @ApiPropertyOptional({
    description: "Filter by school year",
    example: 2025,
  })
  @IsOptional()
  @Type(() => Number)
  schoolYear?: number;
}

export class SearchCommunityResponseDto extends FieldSelectionDto {
  @ApiPropertyOptional({
    description: 'List of communities matching the search criteria',
    isArray: true,
    type: () => CommunityResponseDto,
  })
  communities: CommunityResponseDto[];

  @ApiPropertyOptional()
  total: number;
}

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  displayName: string;
}

export class CommunityStatsDto {
  @ApiProperty()
  totalMembers: number;

  @ApiProperty()
  acceptedMembers: number;

  @ApiProperty()
  totalAdmins: number;

  @ApiProperty()
  acceptedAdmins: number;
}

export class CommunityResponseDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  creationDate: Date;

  @ApiPropertyOptional()
  updateDate?: Date;

  @ApiProperty({ enum: CommunityType })
  type: CommunityType;

  @ApiPropertyOptional()
  schoolYearStart?: number;

  @ApiPropertyOptional()
  schoolYearEnd?: number;

  @ApiPropertyOptional()
  welcomeNote?: string;

  @ApiProperty()
  discussionEnabled: boolean;

  @ApiPropertyOptional()
  archivedDate?: Date;

  // Secret code is excluded by default
  @Exclude()
  secretCode?: string;

  @ApiProperty()
  creator: UserDto;

  @ApiPropertyOptional()
  modifier?: UserDto;

  @ApiPropertyOptional()
  archiver?: UserDto;

  @ApiPropertyOptional()
  stats?: CommunityStatsDto;

  // Expose secret code only when explicitly requested
  @Expose({ groups: ['admin', 'secretCode'] })
  @ApiPropertyOptional({ description: 'Secret code to join the community' })
  getSecretCode(): string | null {
    return this.secretCode || null;
  }
}

export class CommunitySecretCodeDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  secretCode: string;
}