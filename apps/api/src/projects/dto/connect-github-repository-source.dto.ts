import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function trimOptionalString(value: unknown) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export class ConnectGithubRepositorySourceDto {
  @ApiProperty({ description: 'Organization-scoped GitHub connection id' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  connectionId!: string;

  @ApiProperty({ example: '123456789' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  repositoryId!: string;

  @ApiProperty({ example: 'acme' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  repositoryOwner!: string;

  @ApiProperty({ example: 'checkout-web' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  repositoryName!: string;

  @ApiProperty({ example: 'main' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  defaultBranch!: string;

  @ApiPropertyOptional({ example: 'main' })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(200)
  branch?: string;
}
