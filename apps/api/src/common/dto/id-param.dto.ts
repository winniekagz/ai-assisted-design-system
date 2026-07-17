import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    example: '9f0f6f95-6e7d-4d41-b28c-3f6d91f6d111',
    description: 'Resource identifier',
    format: 'uuid',
  })
  @IsUUID()
  id!: string;
}

export class OrgIdParamDto {
  @ApiProperty({
    example: 'acme',
    description: 'Organization identifier or slug',
  })
  @IsString()
  @MinLength(1)
  orgId!: string;
}

export class ComponentIdParamDto {
  @ApiProperty({
    example: 'e09a7c78-fb75-4d17-a7ac-bcf58d817f41',
    description: 'Component identifier',
    format: 'uuid',
  })
  @IsUUID()
  componentId!: string;
}
