import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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
    example: '8bbd7a98-6e91-4eb7-a7a3-6ceaf2c4d711',
    description: 'Organization identifier',
    format: 'uuid',
  })
  @IsUUID()
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
