import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommunityRequestDto {
  
    @ApiProperty({ description: 'Title of the community' })
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ description: 'Description of the community' })
    @IsString()
    @IsNotEmpty()
    description: string;
}
