import { ApiPropertyOptional } from "@nestjs/swagger";

export class AnnouncementDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  publicationDate: Date;

  @ApiPropertyOptional()
  modificationDate?: Date;

  @ApiProperty()
  author: UserDto;

  @ApiProperty()
  communityId: number;
}
export class CreateAnnouncementDto {
  @ApiProperty({
    description: "Announcement content",
    example: "Important information about our next class meeting",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "./base";
import { UserDto } from "./community";
import { Type } from "class-transformer";

export class UpdateAnnouncementDto {
  @ApiProperty({
    description: "Updated announcement content",
    example: "Important information about our rescheduled class meeting",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CountAnnouncementDto {
  @ApiProperty()
  count: number;
}

export class SearchAnnouncementDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Filter announcements published after this date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAfter?: Date;
}
