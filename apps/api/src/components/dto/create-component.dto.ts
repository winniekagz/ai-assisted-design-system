import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({
    example: 'Button',
    description: 'Design system component name',
    minLength: 2,
    maxLength: 120,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'Primary interaction component for actions and form submission.',
    description: 'Short description of what the component is used for',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'Inputs',
    description: 'Component category used for grouping in the catalog',
  })
  @IsString()
  category!: string;

  @ApiProperty({
    example: 'https://design.acme.com/components/button',
    description: 'Optional public or internal documentation URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  docsUrl?: string;

  @ApiProperty({
    example: 'https://storybook.acme.com/?path=/docs/components-button--docs',
    description: 'Optional Storybook documentation URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  storybookUrl?: string;

  @ApiProperty({
    example: 'stable',
    description: 'Lifecycle status for the component in the catalog',
  })
  @IsString()
  status!: string;
}
