import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Organization } from '@prisma/client';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentOrganization } from '../authorization/current-organization.decorator';
import { OrgMembershipGuard } from '../authorization/org-membership.guard';
import { OrganizationMembersService } from './organization-members.service';

@ApiTags('Organization Members')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('organizations/:orgId/members')
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService
  ) {}

  @Get()
  @UseGuards(OrgMembershipGuard)
  @ApiOperation({
    summary: 'List organization members',
    description: 'Returns members for an organization. orgId may be an ID or slug.',
  })
  @ApiParam({ name: 'orgId', description: 'Organization ID or slug' })
  @ApiResponse({ status: 200, description: 'Members returned successfully' })
  list(@CurrentOrganization() organization: Organization) {
    return this.organizationMembersService.list(organization.id);
  }
}
