import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { CommunitySummaryDto } from "./invitation";
import { UserDto } from "./community";
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
  userId: number;

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
  lastVisitDate?: Date;

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
