import { GuardrailCategory, Severity } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateGuardrailDto {
  @IsOptional()
  @IsEnum(GuardrailCategory)
  category?: GuardrailCategory;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  ruleText?: string;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
