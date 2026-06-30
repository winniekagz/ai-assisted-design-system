import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthorizationService } from '../authorization/authorization.service';
import { CurrentMembership } from '../authorization/current-membership.decorator';
import { OrgMembershipGuard } from '../authorization/org-membership.guard';
import { hasPermission } from '../authorization/permissions';
import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { auditSessionExample, ids } from '../common/swagger/api-examples';
import { AuditsService } from './audits.service';
import type { OrganizationMember, User } from '@prisma/client';

@ApiTags('Audits')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class AuditsController {
  constructor(
    private readonly auditsService: AuditsService,
    private readonly authorizationService: AuthorizationService
  ) {}

  @Get('organizations/:orgId/audits')
  @UseGuards(OrgMembershipGuard)
  @ApiOperation({
    summary: 'List organization audits',
    description: 'Returns AI audit sessions for an organization with findings.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Audit sessions returned successfully',
    schema: { example: [auditSessionExample] },
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
    @Param() params: OrgIdParamDto,
    @CurrentUser() user: User,
    @CurrentMembership() membership: OrganizationMember
  ) {
    const viewAll = hasPermission(membership.role, 'audits.view');
    return this.auditsService.findByOrganization(
      params.orgId,
      viewAll ? undefined : user.id
    );
  }

  @Get('audits/:id')
  @ApiOperation({
    summary: 'Get audit',
    description: 'Returns one AI audit session with findings.',
  })
  @ApiParam({
    name: 'id',
    description: 'Audit session identifier',
    example: ids.audit,
  })
  @ApiResponse({
    status: 200,
    description: 'Audit session returned successfully',
    schema: { example: auditSessionExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Audit not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Audit not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: User) {
    const audit = await this.auditsService.findOne(params.id);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      audit.organizationId
    );

    if (
      audit.userId === user.id &&
      hasPermission(membership.role, 'audits.viewOwn')
    ) {
      return audit;
    }

    this.authorizationService.assertPermission(membership, 'audits.view');
    return audit;
  }
}
