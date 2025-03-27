import { ApiProperty } from '@nestjs/swagger';

export class PaginagedMetadataResponseDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  size: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalPages: number;
}
