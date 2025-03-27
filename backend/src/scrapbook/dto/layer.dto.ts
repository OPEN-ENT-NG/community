import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LayerDto {
  @ApiProperty({ description: 'X coordinate', default: 0 })
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiProperty({ description: 'Y coordinate', default: 0 })
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiProperty({ description: 'Z index', default: 0 })
  @IsNumber()
  @IsOptional()
  z?: number;

  @ApiProperty({ description: 'Width', nullable: true })
  @IsNumber()
  @IsOptional()
  w?: number | null;

  @ApiProperty({ description: 'Height', nullable: true })
  @IsNumber()
  @IsOptional()
  h?: number | null;

  @ApiProperty({ description: 'Media', nullable: true })
  @IsString()
  @IsOptional()
  media?: string | null;
}
