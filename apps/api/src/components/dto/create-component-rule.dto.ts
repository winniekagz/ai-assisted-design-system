import { Severity } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateComponentRuleDto {
  @ApiProperty({
    example: 'accessibility',
    description: 'Rule classification for the component',
  })
  @IsString()
  ruleType!: string;

  @ApiProperty({
    example: 'Icon-only buttons must include an accessible label.',
    description: 'Human-readable rule that should be followed for the component',
  })
  @IsString()
  ruleText!: string;

  @ApiProperty({
    example: Severity.HIGH,
    description: 'Severity level applied when this rule is violated',
    enum: Severity,
  })
  @IsEnum(Severity)
  severity!: Severity;

  @ApiProperty({
    example: '<Button aria-label="Close"><XIcon /></Button>',
    description: 'Optional example of correct usage',
    required: false,
  })
  @IsOptional()
  @IsString()
  exampleGood?: string;

  @ApiProperty({
    example: '<Button><XIcon /></Button>',
    description: 'Optional example of incorrect usage',
    required: false,
  })
  @IsOptional()
  @IsString()
  exampleBad?: string;
}
