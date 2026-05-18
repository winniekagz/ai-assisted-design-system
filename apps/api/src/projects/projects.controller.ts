import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OrgIdParamDto } from '../common/dto/id-param.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(params.orgId, dto);
  }

  @Get()
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.projectsService.findByOrganization(params.orgId);
  }
}
