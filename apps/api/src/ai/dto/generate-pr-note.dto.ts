import { IsOptional, IsString, IsUUID } from 'class-validator';
import type { GeneratePrNoteRequest } from '@winniekagendo/componentiq-shared-types';

export class GeneratePrNoteDto implements GeneratePrNoteRequest {
  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsUUID()
  recommendationId?: string;

  @IsOptional()
  @IsUUID()
  auditId?: string;

  @IsOptional()
  @IsString()
  context?: string;
}
