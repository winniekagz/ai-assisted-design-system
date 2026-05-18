import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.organizationsService.findOne(params.id);
  }
}
