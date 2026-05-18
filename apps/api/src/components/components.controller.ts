import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import {
  ComponentIdParamDto,
  IdParamDto,
  OrgIdParamDto,
} from '../common/dto/id-param.dto';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { CreateComponentRuleDto } from './dto/create-component-rule.dto';

@Controller()
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post('organizations/:orgId/components')
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateComponentDto) {
    return this.componentsService.create(params.orgId, dto);
  }

  @Get('organizations/:orgId/components')
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.componentsService.findByOrganization(params.orgId);
  }

  @Get('components/:id')
  findOne(@Param() params: IdParamDto) {
    return this.componentsService.findOne(params.id);
  }

  @Post('components/:componentId/rules')
  createRule(
    @Param() params: ComponentIdParamDto,
    @Body() dto: CreateComponentRuleDto
  ) {
    return this.componentsService.createRule(params.componentId, dto);
  }

  @Get('components/:componentId/rules')
  findRules(@Param() params: ComponentIdParamDto) {
    return this.componentsService.findRules(params.componentId);
  }
}
