import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class OwnerDto {
  @ApiProperty({ description: 'User ID of the owner' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Display name of the owner' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}