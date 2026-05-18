import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateComponentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  docsUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  storybookUrl?: string;

  @IsString()
  status!: string;
}
