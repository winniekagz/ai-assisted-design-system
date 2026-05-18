import { IsBoolean, IsString, IsUUID } from 'class-validator';
import type { SetupGuidanceRequest } from '@winniekagendo/componentiq-shared-types';

export class SetupGuidanceDto implements SetupGuidanceRequest {
  @IsUUID()
  organizationId!: string;

  @IsString()
  framework!: string;

  @IsString()
  packageManager!: string;

  @IsBoolean()
  typescript!: boolean;

  @IsBoolean()
  storybook!: boolean;
}
