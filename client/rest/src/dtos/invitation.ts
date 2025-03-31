// src/invitation/dto/create-invitation.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { UserDto } from "./community";
import { PaginationQueryDto } from "./base";

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
export class CreateInvitationDto {
  @ApiProperty({
    description: "Community ID",
    example: 1,
  })
  @IsInt()
  communityId: number;

  @ApiProperty({
    description: "List of user IDs to invite",
    example: [
      "b9ea566a-c3d4-41ef-9806-65d6beb3bddb",
      "b9ea566a-c3d4-41ef-9806-65d6beb3bddc",
    ],
    type: [String],
  })
  @IsUUID(4, { each: true })
  userIds: string[];

  @ApiPropertyOptional({
    description: "Optional message to include with invitation",
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateInvitationStatusDto {
  @ApiProperty({
    description: "New status for the invitation",
    enum: InvitationStatus,
    example: InvitationStatus.ACCEPTED,
  })
  @IsEnum(InvitationStatus)
  status: InvitationStatus;

  @ApiProperty({
    description: "Whether to delete shared resources when rejecting invitation",
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  deleteSharedResources?: boolean;
}

export class SearchInvitationDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Community ID",
  })
  @IsOptional()
  @IsUUID(4)
  communityId?: string;

  @ApiPropertyOptional({
    description: "User ID",
  })
  @IsOptional()
  @IsUUID(4)
  userId?: string;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: InvitationStatus,
  })
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;

  @ApiPropertyOptional({
    description: "Filter invitations sent after this date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentAfter?: Date;
}
export class CommunitySummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

export class InvitationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  invitationDate: Date;

  @ApiProperty({ enum: InvitationStatus })
  status: InvitationStatus;

  @ApiProperty()
  community: CommunitySummaryDto;

  @ApiProperty()
  user: UserDto;
}

export class InvitationStatsDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  accepted: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  rejected: number;
}

function Type(
  arg0: () => DateConstructor
): (target: SearchInvitationDto, propertyKey: "sentAfter") => void {
  throw new Error("Function not implemented.");
}
