import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MemberDto } from "./member.dto";
import { Expose, Type } from "class-transformer";

export class CommunityDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier of the community' })
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({ description: 'Title of the community' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @ApiProperty({ description: 'Description of the community' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @ApiProperty({ description: 'Date when the community was created', type: Date })
  @IsDate()
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Date when the community was last updated', type: Date })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @Expose()
  @ApiProperty({ description: 'List of members in the community', type: [MemberDto] , isArray: true})
  @IsArray()
  @IsOptional()
  @Type(() => MemberDto)
  members?: MemberDto[];
}