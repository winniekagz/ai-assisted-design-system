import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import type { SetupGuidanceRequest } from '@winniekagendo/componentiq-shared-types';

export class SetupGuidanceDto implements SetupGuidanceRequest {
  @ApiProperty({
    example: '8bbd7a98-6e91-4eb7-a7a3-6ceaf2c4d711',
    description: 'Organization identifier used to load guardrails',
    format: 'uuid',
  })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({
    example: 'Next.js',
    description: 'Framework the setup guidance should target',
  })
  @IsString()
  framework!: string;

  @ApiProperty({
    example: 'npm',
    description: 'Package manager the setup instructions should use',
  })
  @IsString()
  packageManager!: string;

  @ApiProperty({
    example: true,
    description: 'Whether the consuming project uses TypeScript',
  })
  @IsBoolean()
  typescript!: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether Storybook setup guidance should be included',
  })
  @IsBoolean()
  storybook!: boolean;
}
