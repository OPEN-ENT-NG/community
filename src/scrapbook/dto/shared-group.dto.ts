import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SharedGroupDto {
  @ApiProperty({ description: 'Group ID' })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;


  [key: string]: string | boolean | undefined;
}