import { GuardrailCategory, Severity } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateGuardrailDto {
  @ApiProperty({
    example: GuardrailCategory.COMPONENT_USAGE,
    description: 'Updated design governance category',
    enum: GuardrailCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(GuardrailCategory)
  category?: GuardrailCategory;

  @ApiProperty({
    example: 'Use documented components before custom UI',
    description: 'Updated guardrail title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example:
      'Prefer catalog components for common UI patterns before introducing custom implementations.',
    description: 'Updated guardrail rule text',
    required: false,
  })
  @IsOptional()
  @IsString()
  ruleText?: string;

  @ApiProperty({
    example: Severity.MEDIUM,
    description: 'Updated severity level',
    enum: Severity,
    required: false,
  })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @ApiProperty({
    example: false,
    description: 'Whether the guardrail should be active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
