import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class InviteTokenDto {
  @ApiProperty({
    description: 'Raw invite token from the invite link.',
    minLength: 32,
  })
  @IsString()
  @MinLength(32)
  token!: string;
}
