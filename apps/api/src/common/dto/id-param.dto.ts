import { IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID()
  id!: string;
}

export class OrgIdParamDto {
  @IsUUID()
  orgId!: string;
}

export class ComponentIdParamDto {
  @IsUUID()
  componentId!: string;
}
