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
} from 'class-validator';
export class CreateInvitationDto {
  @ApiProperty({
    description: "List of user IDs to invite",
    example: [1, 2, 3],
  })
  @IsUUID(4, { each: true })
  userIds: string[];
}
