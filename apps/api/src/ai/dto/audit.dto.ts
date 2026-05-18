import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import type {
  AuditInputType,
  AuditRequest,
} from '@winniekagendo/componentiq-shared-types';

export class AuditDto implements AuditRequest {
  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  auditType!: string;

  @IsIn(['jsx', 'plan', 'diff'])
  inputType!: AuditInputType;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
