import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import { OrgIdParamDto } from '../common/dto/id-param.dto';
import { ids, projectExample } from '../common/swagger/api-examples';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @RequirePermission('projects.manage')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create project',
    description: 'Creates a project inside an organization.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      createProject: {
        summary: 'Create a Next.js project',
        value: {
          name: 'Acme Web App',
          slug: 'acme-web-app',
          framework: 'Next.js',
          packageManager: 'npm',
          stylingSystem: 'Tailwind CSS',
          repositoryUrl: 'https://github.com/acme/acme-web-app',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: { example: projectExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Organization not found',
        error: 'Not Found',
      },
    },
  })
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(params.orgId, dto);
  }

  @Get()
  @RequirePermission('projects.view')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'List organization projects',
    description: 'Returns projects for an organization ordered by newest first.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Projects returned successfully',
    schema: { example: [projectExample] },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Organization not found',
        error: 'Not Found',
      },
    },
  })
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.projectsService.findByOrganization(params.orgId);
  }
}
