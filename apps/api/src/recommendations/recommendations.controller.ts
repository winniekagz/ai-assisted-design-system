import { Controller, Get, Param } from '@nestjs/common';

import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { RecommendationsService } from './recommendations.service';

@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Get('organizations/:orgId/recommendations')
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.recommendationsService.findByOrganization(params.orgId);
  }

  @Get('recommendations/:id')
  findOne(@Param() params: IdParamDto) {
    return this.recommendationsService.findOne(params.id);
  }
}
