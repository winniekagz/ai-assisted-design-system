import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug?: string;

  @IsString()
  framework!: string;

  @IsString()
  packageManager!: string;

  @IsString()
  stylingSystem!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  repositoryUrl?: string;
}
