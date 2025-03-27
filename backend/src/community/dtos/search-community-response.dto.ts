import { ApiProperty } from '@nestjs/swagger';
import { CommunityDto } from './community.dto';
import { PaginagedMetadataResponseDto } from 'src/common/paginaged-metadata-response.dto';

export class SearchCommunityResponseDto {
  @ApiProperty({isArray: true, type: CommunityDto})
  data: CommunityDto[];
  @ApiProperty({isArray: true})
  meta: PaginagedMetadataResponseDto;
}
