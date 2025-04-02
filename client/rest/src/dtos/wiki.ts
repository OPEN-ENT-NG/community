import { ApiProperty } from "@nestjs/swagger";


export class CountWikiPagesDto {
  @ApiProperty()
  count: number;
}