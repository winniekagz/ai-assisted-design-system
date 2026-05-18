import { GuardrailCategory, Severity } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateGuardrailDto {
  @IsEnum(GuardrailCategory)
  category!: GuardrailCategory;

  @IsString()
  title!: string;

  @IsString()
  ruleText!: string;

  @IsEnum(Severity)
  severity!: Severity;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
