import { GuardrailCategory, Severity } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateGuardrailDto {
  @ApiProperty({
    example: GuardrailCategory.ACCESSIBILITY,
    description: 'Design governance category this guardrail belongs to',
    enum: GuardrailCategory,
  })
  @IsEnum(GuardrailCategory)
  category!: GuardrailCategory;

  @ApiProperty({
    example: 'Interactive controls need accessible names',
    description: 'Short guardrail title',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example:
      'Every interactive icon-only control must provide an aria-label or visible text.',
    description: 'Detailed guardrail rule text',
  })
  @IsString()
  ruleText!: string;

  @ApiProperty({
    example: Severity.HIGH,
    description: 'Severity applied when this guardrail is violated',
    enum: Severity,
  })
  @IsEnum(Severity)
  severity!: Severity;

  @ApiProperty({
    example: true,
    description: 'Whether this guardrail is active. Defaults to true.',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
