import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class MemberDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier of the community' })
  @IsNotEmpty()
  id: number;
  
  @Expose()
  @ApiProperty({ description: 'Reference to an ENT user' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value, obj }) => obj.ent_id)
  entId: string;
}
