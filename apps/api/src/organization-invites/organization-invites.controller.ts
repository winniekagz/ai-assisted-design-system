import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Organization, User } from '@prisma/client';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentOrganization } from '../authorization/current-organization.decorator';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import { CreateOrganizationInviteDto } from './dto/create-organization-invite.dto';
import { InviteTokenDto } from './dto/invite-token.dto';
import { OrganizationInvitesService } from './organization-invites.service';

@ApiTags('Organization Invites')
@Controller()
export class OrganizationInvitesController {
  constructor(
    private readonly organizationInvitesService: OrganizationInvitesService
  ) {}

  @Get('organizations/:orgId/invites')
  @ApiBearerAuth()
  @RequirePermission('members.invite')
  @UseGuards(ClerkAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'List organization invites',
    description: 'Returns invites for an organization. orgId may be an ID or slug.',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID or slug' })
  @ApiResponse({ status: 200, description: 'Invites returned successfully' })
  list(@CurrentOrganization() organization: Organization) {
    return this.organizationInvitesService.list(organization.id);
  }

  @Post('organizations/:orgId/invites')
  @ApiBearerAuth()
  @RequirePermission('members.invite')
  @UseGuards(ClerkAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: 'Create organization invite',
    description:
      'Creates a pending invite and sends an email to the invited address.',
  })
  create(
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Body() dto: CreateOrganizationInviteDto
  ) {
    return this.organizationInvitesService.create(organization, user, dto);
  }

  @Get('invites/validate')
  @ApiOperation({ summary: 'Validate invite token' })
  validate(@Query() query: InviteTokenDto) {
    return this.organizationInvitesService.validate(query.token);
  }

  @Post('invites/accept')
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Accept invite token' })
  accept(@CurrentUser() user: User, @Body() dto: InviteTokenDto) {
    return this.organizationInvitesService.accept(dto.token, user);
  }
}
