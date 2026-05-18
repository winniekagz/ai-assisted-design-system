import { Controller, Get, Param } from '@nestjs/common';

import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { AuditsService } from './audits.service';

@Controller()
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Get('organizations/:orgId/audits')
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.auditsService.findByOrganization(params.orgId);
  }

  @Get('audits/:id')
  findOne(@Param() params: IdParamDto) {
    return this.auditsService.findOne(params.id);
  }
}
