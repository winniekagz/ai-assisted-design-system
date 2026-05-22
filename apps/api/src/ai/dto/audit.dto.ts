import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import type {
  AuditInputType,
  AuditRequest,
} from '@winniekagendo/componentiq-shared-types';

export class AuditDto implements AuditRequest {
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
    example: 'pre-pr',
    description: 'Business label describing the audit workflow',
  })
  @IsString()
  auditType!: string;

  @ApiProperty({
    example: 'jsx',
    description: 'Type of content submitted for review',
    enum: ['jsx', 'plan', 'diff'],
  })
  @IsIn(['jsx', 'plan', 'diff'])
  inputType!: AuditInputType;

  @ApiProperty({
    example:
      '<button className="icon-btn"><TrashIcon /></button>',
    description: 'Source content, implementation plan, or diff to audit',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: ['accessibility', 'component-usage'],
    description: 'Optional audit categories to focus the review',
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
