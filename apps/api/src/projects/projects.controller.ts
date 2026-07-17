import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Organization, User } from '@prisma/client';
import {
  PERMISSIONS,
  type ProjectListItem,
} from '@winniekagendo/componentiq-shared-types';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentOrganization } from '../authorization/current-organization.decorator';
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
  @RequirePermission(PERMISSIONS.PROJECT_CREATE)
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
        summary: 'Create a project',
        value: {
          name: 'Acme Web App',
          description: 'Customer checkout product',
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
  create(
    @Param() _params: OrgIdParamDto,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Body() dto: CreateProjectDto
  ): Promise<ProjectListItem> {
    return this.projectsService.create({
      organizationId: organization.id,
      actorUserId: user.id,
      input: dto,
    });
  }

  @Get()
  @RequirePermission(PERMISSIONS.PROJECT_VIEW)
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
  findByOrganization(
    @Param() _params: OrgIdParamDto,
    @CurrentOrganization() organization: Organization
  ): Promise<ProjectListItem[]> {
    return this.projectsService.findByOrganization(organization.id);
  }
}
