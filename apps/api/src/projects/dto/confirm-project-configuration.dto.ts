import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

function trimOptionalString(value: unknown) {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function trimOptionalStringArray(value: unknown) {
  if (!Array.isArray(value)) return value;

  const values = value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

export class ConfirmProjectConfigurationDto {
  @ApiPropertyOptional({ example: 'NEXTJS', maxLength: 80 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  framework?: string;

  @ApiPropertyOptional({ example: 'TYPESCRIPT', maxLength: 80 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  language?: string;

  @ApiPropertyOptional({ example: 'PNPM', maxLength: 80 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(80)
  packageManager?: string;

  @ApiPropertyOptional({ example: 'TAILWIND', maxLength: 120 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(120)
  stylingSystem?: string;

  @ApiPropertyOptional({ example: 'apps/web', maxLength: 300 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(300)
  projectRoot?: string;

  @ApiPropertyOptional({
    example: ['src/components', 'src/features'],
    maxItems: 50,
  })
  @Transform(({ value }) => trimOptionalStringArray(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  componentPaths?: string[];

  @ApiPropertyOptional({
    example: ['src/styles/tokens.css'],
    maxItems: 50,
  })
  @Transform(({ value }) => trimOptionalStringArray(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  tokenPaths?: string[];

  @ApiPropertyOptional({ example: 'Reviewed by design systems lead.', maxLength: 1000 })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
