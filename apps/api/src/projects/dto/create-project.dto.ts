import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Acme Web App',
    description: 'Project name',
    minLength: 2,
    maxLength: 120,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'acme-web-app',
    description:
      'Optional URL-friendly project slug. When omitted, it is generated from the name.',
    required: false,
    minLength: 2,
    maxLength: 80,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  slug?: string;

  @ApiProperty({
    example: 'Next.js',
    description: 'Primary application framework used by the project',
  })
  @IsString()
  framework!: string;

  @ApiProperty({
    example: 'npm',
    description: 'Package manager used by the project',
  })
  @IsString()
  packageManager!: string;

  @ApiProperty({
    example: 'Tailwind CSS',
    description: 'Styling system or UI styling approach used by the project',
  })
  @IsString()
  stylingSystem!: string;

  @ApiProperty({
    example: 'https://github.com/acme/acme-web-app',
    description: 'Optional source repository URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  repositoryUrl?: string;
}
