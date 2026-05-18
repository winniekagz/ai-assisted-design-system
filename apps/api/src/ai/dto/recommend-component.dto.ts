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
  @IsOptional()
  @IsString()
  surface?: string;

  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsString()
  framework?: string;
}

export class RecommendComponentDto implements RecommendComponentRequest {
  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  userGoal!: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RecommendationContextDto)
  context?: RecommendationContextDto;
}
