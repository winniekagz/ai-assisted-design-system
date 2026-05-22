import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import type { GeneratePrNoteRequest } from '@winniekagendo/componentiq-shared-types';

export class GeneratePrNoteDto implements GeneratePrNoteRequest {
  @ApiProperty({
    example: '8bbd7a98-6e91-4eb7-a7a3-6ceaf2c4d711',
    description: 'Organization identifier used to load guardrails and context',
    format: 'uuid',
  })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({
    example: '68bc4f37-7c3c-4cb6-b26d-6e4de73eb4c5',
    description: 'Optional recommendation session to summarize in the PR note',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  recommendationId?: string;

  @ApiProperty({
    example: '03a721b7-1d1b-4f02-911f-ff491bf82b18',
    description: 'Optional audit session to summarize in the PR note',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  auditId?: string;

  @ApiProperty({
    example: 'This PR replaces a custom destructive button with the design-system Button component.',
    description: 'Optional extra context to include in the generated PR note',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}
