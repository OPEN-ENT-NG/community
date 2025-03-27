import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthorDto {
  @ApiProperty({ description: 'User ID of the author' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Username', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Login name' })
  @IsString()
  @IsNotEmpty()
  login: string;
}