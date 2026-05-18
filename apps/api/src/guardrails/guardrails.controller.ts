import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { CreateGuardrailDto } from './dto/create-guardrail.dto';
import { UpdateGuardrailDto } from './dto/update-guardrail.dto';
import { GuardrailsService } from './guardrails.service';

@Controller()
export class GuardrailsController {
  constructor(private readonly guardrailsService: GuardrailsService) {}

  @Post('organizations/:orgId/guardrails')
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateGuardrailDto) {
    return this.guardrailsService.create(params.orgId, dto);
  }

  @Get('organizations/:orgId/guardrails')
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.guardrailsService.findByOrganization(params.orgId);
  }

  @Patch('guardrails/:id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateGuardrailDto) {
    return this.guardrailsService.update(params.id, dto);
  }
}
