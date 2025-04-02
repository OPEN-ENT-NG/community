import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { CommunitySummaryDto } from "./invitation";
import { UserDto } from "./community";
import { FieldSelectionDto } from "./base";
import { Type } from "class-transformer";
export enum MembershipRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export class JoinCommunityDto {
  @ApiProperty({
    description: "Secret code to join the community",
  })
  @IsString()
  secretCode: string;
}

export class CreateMembershipDto {
  @ApiProperty({
    description: "User ID",
    example: 1,
  })
  userId: string;

  @ApiProperty({
    description: "Role in the community",
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  @IsEnum(MembershipRole)
  role: MembershipRole = MembershipRole.MEMBER;
}
export class UpdateMembershipDto {
  @ApiPropertyOptional({
    description: "Role in the community",
    enum: MembershipRole,
  })
  @IsOptional()
  @IsEnum(MembershipRole)
  role?: MembershipRole;
}

export class MembershipResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  joinDate: Date;

  @ApiProperty({ enum: MembershipRole })
  role: MembershipRole;

  @ApiPropertyOptional()
  lastVisitAnnouncementsDate?: Date;

  @ApiPropertyOptional()
  lastVisitResourcesDate?: Date;

  @ApiPropertyOptional()
  lastVisitWikiDate?: Date;

  @ApiPropertyOptional()
  lastVisitDiscussionsDate?: Date;

  @ApiProperty()
  community: CommunitySummaryDto;

  @ApiProperty()
  user: UserDto;

  @ApiPropertyOptional()
  inviter?: UserDto;
}

export class LeaveCommunityOptionsDto {
  @ApiProperty({
    description: "Whether to remove shared resources",
    default: false,
  })
  removeSharedResources: boolean = false;
}

export class SearchMembershipResponseDto extends FieldSelectionDto {
  @ApiPropertyOptional({
    description: "List of memberships matching the search criteria",
    isArray: true,
    type: () => MembershipResponseDto,
  })
  invitations: MembershipResponseDto[];

  @ApiPropertyOptional()
  total: number;
}

export class CreateMembershipBatchDto {
  @ApiProperty({
    description: "List of members to add to the community",
    isArray: true,
    type: () => CreateMembershipDto,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMembershipDto)
  members: CreateMembershipDto[];
}
