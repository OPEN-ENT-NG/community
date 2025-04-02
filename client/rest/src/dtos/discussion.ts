import { ApiProperty } from "@nestjs/swagger";

export class CountDiscussionDto {
  @ApiProperty()
  count: number;
}
export class CountDiscussionMessageDto {
  @ApiProperty()
  count: number;
}
