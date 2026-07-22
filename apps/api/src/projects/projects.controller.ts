import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  PROJECT_CONFIGURATION_STATUSES,
  type LocalProjectUploadResponse,
  type ProjectSourceAnalysisResponse,
  type ProjectConfigurationStatus,
  type ProjectConfigurationConfirmResponse,
  type ProjectConfigurationSummary,
  type ProjectListItem,
} from '@winniekagendo/componentiq-shared-types';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentOrganization } from '../authorization/current-organization.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import { OrgIdParamDto } from '../common/dto/id-param.dto';
import { ids, projectExample } from '../common/swagger/api-examples';
import { ConfirmProjectConfigurationDto } from './dto/confirm-project-configuration.dto';
import { ConnectGithubRepositorySourceDto } from './dto/connect-github-repository-source.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { GithubProjectImportService } from './github-project-import.service';
import { LocalProjectImportService } from './local-project-import.service';
import { ProjectConfigurationService } from './project-configuration.service';
import { ProjectsService } from './projects.service';

type UploadedProjectFile = {
  originalname: string;
  buffer: Buffer;
  size: number;
};

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectConfigurationService: ProjectConfigurationService,
    private readonly localProjectImportService: LocalProjectImportService,
    private readonly githubProjectImportService: GithubProjectImportService
  ) {}

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
    @CurrentOrganization() organization: Organization,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('configurationStatus') configurationStatus?: string
  ): Promise<ProjectListItem[]> {
    return this.projectsService.findByOrganization(organization.id, {
      limit: parseOptionalInteger(limit),
      offset: parseOptionalInteger(offset),
      search,
      configurationStatus: parseConfigurationStatus(configurationStatus),
    });
  }

  @Get(':projectId/configuration')
  @RequirePermission(PERMISSIONS.PROJECT_VIEW)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Get project configuration status',
    description:
      'Returns the organization-scoped configuration summary for a project.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: ids.project,
  })
  @ApiResponse({
    status: 200,
    description: 'Project configuration summary returned successfully',
    schema: {
      example: {
        projectId: ids.project,
        projectStatus: 'NOT_CONFIGURED',
        latestJobId: null,
        latestJobStatus: null,
        sourceType: null,
        progress: null,
        requiresReview: false,
        canRetry: false,
        lastError: null,
        detectedConfiguration: null,
        updatedAt: '2026-07-17T09:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found',
  })
  getConfigurationSummary(
    @Param('projectId') projectId: string,
    @CurrentOrganization() organization: Organization
  ): Promise<ProjectConfigurationSummary> {
    return this.projectConfigurationService.getProjectConfigurationSummary({
      organizationId: organization.id,
      projectId,
    });
  }

  @Post(':projectId/configuration/confirm')
  @RequirePermission(PERMISSIONS.PROJECT_UPDATE)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Confirm project configuration',
    description:
      'Persists the reviewed project setup and marks the configuration job complete.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: ids.project,
  })
  @ApiBody({ type: ConfirmProjectConfigurationDto })
  @ApiResponse({
    status: 201,
    description: 'Project configuration confirmed successfully',
  })
  confirmConfiguration(
    @Param('projectId') projectId: string,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Body() dto: ConfirmProjectConfigurationDto
  ): Promise<ProjectConfigurationConfirmResponse> {
    return this.projectConfigurationService.confirmProjectConfiguration({
      organizationId: organization.id,
      projectId,
      userId: user.id,
      input: dto,
    });
  }

  @Post(':projectId/local-source')
  @RequirePermission(PERMISSIONS.PROJECT_UPDATE)
  @UseGuards(PermissionsGuard)
  @UseInterceptors(
    FilesInterceptor('files', 5000, {
      limits: {
        fileSize: 250 * 1024 * 1024,
        files: 5000,
      },
      preservePath: true,
    })
  )
  @ApiOperation({
    summary: 'Upload and analyze local project source',
    description:
      'Accepts a browser-selected local source snapshot, runs deterministic backend project detection, and moves the configuration job to review required.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: ids.project,
  })
  @ApiResponse({
    status: 201,
    description: 'Local project source analyzed and review result persisted',
  })
  uploadLocalSource(
    @Param('projectId') projectId: string,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @UploadedFiles() files: UploadedProjectFile[]
  ): Promise<LocalProjectUploadResponse> {
    return this.localProjectImportService.analyzeLocalUpload({
      organizationId: organization.id,
      projectId,
      userId: user.id,
      files: files ?? [],
    });
  }

  @Post(':projectId/github-source')
  @RequirePermission(PERMISSIONS.PROJECT_UPDATE)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Fetch and analyze GitHub repository source',
    description:
      'Fetches the selected GitHub repository through the organization GitHub App installation, runs deterministic backend project detection, and moves the configuration job to review required.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiParam({
    name: 'projectId',
    description: 'Project identifier',
    example: ids.project,
  })
  @ApiBody({ type: ConnectGithubRepositorySourceDto })
  @ApiResponse({
    status: 201,
    description: 'GitHub project source analyzed and review result persisted',
  })
  uploadGithubSource(
    @Param('projectId') projectId: string,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Body() dto: ConnectGithubRepositorySourceDto
  ): Promise<ProjectSourceAnalysisResponse> {
    return this.githubProjectImportService.analyzeGithubRepository({
      organizationId: organization.id,
      projectId,
      userId: user.id,
      connectionId: dto.connectionId,
      repositoryOwner: dto.repositoryOwner,
      repositoryName: dto.repositoryName,
      branch: dto.branch,
    });
  }
}

function parseOptionalInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseConfigurationStatus(
  value: string | undefined
): ProjectConfigurationStatus | undefined {
  if (!value) {
    return undefined;
  }

  return PROJECT_CONFIGURATION_STATUSES.includes(
    value as ProjectConfigurationStatus
  )
    ? (value as ProjectConfigurationStatus)
    : undefined;
}
