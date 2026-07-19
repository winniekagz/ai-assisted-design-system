import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Organization, OrganizationMember, User } from '@prisma/client';
import {
  PERMISSIONS,
  type GitHubConnectionCallbackResult,
  type GitHubConnectionStartResponse,
  type GitProviderConnectionSummary,
} from '@winniekagendo/componentiq-shared-types';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentMembership } from '../authorization/current-membership.decorator';
import { CurrentOrganization } from '../authorization/current-organization.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import { ids } from '../common/swagger/api-examples';
import { GithubIntegrationService } from './github-integration.service';

@ApiTags('GitHub Integrations')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class GithubIntegrationsController {
  constructor(private readonly githubIntegrationService: GithubIntegrationService) {}

  @Get('organizations/:orgId/integrations/github')
  @RequirePermission(PERMISSIONS.PROJECT_VIEW)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'List GitHub provider connections',
    description:
      'Returns GitHub App installation connections associated with the organization.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier or slug',
    example: ids.organization,
  })
  @ApiResponse({ status: 200, description: 'GitHub connections returned' })
  listConnections(
    @CurrentOrganization() organization: Organization
  ): Promise<GitProviderConnectionSummary[]> {
    return this.githubIntegrationService.listConnections(organization.id);
  }

  @Post('organizations/:orgId/integrations/github/connect')
  @RequirePermission(PERMISSIONS.PROJECT_CREATE)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Start GitHub App installation connection',
    description:
      'Creates a signed state value and returns the GitHub App installation URL.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier or slug',
    example: ids.organization,
  })
  @ApiQuery({
    name: 'returnPath',
    required: false,
    description: 'Safe in-app path to return to after connection',
  })
  @ApiResponse({ status: 201, description: 'GitHub connection URL returned' })
  startConnection(
    @CurrentOrganization() organization: Organization,
    @CurrentMembership() membership: OrganizationMember,
    @CurrentUser() user: User,
    @Query('returnPath') returnPath?: string
  ): Promise<GitHubConnectionStartResponse> {
    return this.githubIntegrationService.startConnection({
      organization,
      membership,
      user,
      returnPath,
    });
  }

  @Delete('organizations/:orgId/integrations/github/:connectionId/disconnect')
  @RequirePermission(PERMISSIONS.PROJECT_CREATE)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Disconnect GitHub provider connection',
    description:
      'Disconnects only the Component IQ association. The GitHub App installation may still exist on GitHub.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier or slug',
    example: ids.organization,
  })
  @ApiParam({
    name: 'connectionId',
    description: 'GitHub provider connection identifier',
  })
  @ApiResponse({ status: 200, description: 'GitHub connection disconnected' })
  disconnectConnection(
    @CurrentOrganization() organization: Organization,
    @CurrentMembership() membership: OrganizationMember,
    @Param('connectionId') connectionId: string
  ): Promise<GitProviderConnectionSummary> {
    return this.githubIntegrationService.disconnectConnection({
      organizationId: organization.id,
      membership,
      connectionId,
    });
  }

  @Get('integrations/github/callback')
  @ApiOperation({
    summary: 'Complete GitHub App installation callback',
    description:
      'Verifies signed state and associates a GitHub App installation with the authenticated organization.',
  })
  @ApiQuery({ name: 'state', required: true })
  @ApiQuery({ name: 'installation_id', required: false })
  @ApiQuery({ name: 'setup_action', required: false })
  @ApiResponse({ status: 200, description: 'GitHub connection completed' })
  completeConnection(
    @CurrentUser() user: User,
    @Query('state') state: string,
    @Query('installation_id') installationId?: string,
    @Query('setup_action') setupAction?: string,
    @Query('account_login') accountLogin?: string,
    @Query('account_type') accountType?: string,
    @Query('organizationId') organizationIdFromClient?: string
  ): Promise<GitHubConnectionCallbackResult> {
    return this.githubIntegrationService.completeConnection({
      user,
      state,
      installationId,
      setupAction,
      accountLogin,
      accountType,
      organizationIdFromClient,
    });
  }
}
