import { ApiProperty } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { RecommendComponentRequest } from '@winniekagendo/componentiq-shared-types';

class RecommendationContextDto {
  @ApiProperty({
    example: 'checkout form',
    description: 'UI surface or product area where the component will be used',
    required: false,
  })
  @IsOptional()
  @IsString()
  surface?: string;

  @ApiProperty({
    example: 'medium',
    description: 'Risk level or review sensitivity for the recommendation',
    required: false,
  })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiProperty({
    example: 'React',
    description: 'Frontend framework context for the consuming application',
    required: false,
  })
  @IsOptional()
  @IsString()
  framework?: string;
}

export class RecommendComponentDto implements RecommendComponentRequest {
  @ApiProperty({
    example: '8bbd7a98-6e91-4eb7-a7a3-6ceaf2c4d711',
    description: 'Organization identifier used to load catalog and guardrails',
    format: 'uuid',
  })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({
    example: '45787d86-5a54-4e62-a52d-a2c7b78bdf61',
    description: 'Optional project identifier for project-specific context',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({
    example: '7de7ec3b-4972-481f-82de-9e36e9fb7e6c',
    description: 'Optional user identifier for auditability and usage logging',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: 'I need a destructive confirmation action in a settings panel.',
    description: 'Natural-language goal describing the UI need',
  })
  @IsString()
  userGoal!: string;

  @ApiProperty({
    example: {
      surface: 'settings panel',
      riskLevel: 'high',
      framework: 'React',
    },
    description: 'Optional product and technical context for the recommendation',
    required: false,
    type: () => RecommendationContextDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RecommendationContextDto)
  context?: RecommendationContextDto;
}
