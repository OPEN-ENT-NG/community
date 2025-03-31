import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { CreateInvitationDto } from "./invitations";

enum CommunityType {
  CLASS = "CLASS",
  FREE = "FREE",
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
  @Type(() => CreateInvitationDto)
  invitations?: CreateInvitationDto;
}
