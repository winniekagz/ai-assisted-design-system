import { Severity } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateComponentRuleDto {
  @IsString()
  ruleType!: string;

  @IsString()
  ruleText!: string;

  @IsEnum(Severity)
  severity!: Severity;

  @IsOptional()
  @IsString()
  exampleGood?: string;

  @IsOptional()
  @IsString()
  exampleBad?: string;
}
