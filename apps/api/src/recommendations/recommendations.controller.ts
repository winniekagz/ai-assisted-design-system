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
import {
  ids,
  recommendationSessionExample,
} from '../common/swagger/api-examples';
import { RecommendationsService } from './recommendations.service';
import type { OrganizationMember, User } from '@prisma/client';

@ApiTags('Recommendations')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly authorizationService: AuthorizationService
  ) {}

  @Get('organizations/:orgId/recommendations')
  @UseGuards(OrgMembershipGuard)
  @ApiOperation({
    summary: 'List organization recommendations',
    description:
      'Returns AI component recommendation sessions for an organization with alternatives.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendation sessions returned successfully',
    schema: { example: [recommendationSessionExample] },
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
    const viewAll = hasPermission(membership.role, 'recommendations.view');
    return this.recommendationsService.findByOrganization(
      params.orgId,
      viewAll ? undefined : user.id
    );
  }

  @Get('recommendations/:id')
  @ApiOperation({
    summary: 'Get recommendation',
    description: 'Returns one AI recommendation session with alternatives.',
  })
  @ApiParam({
    name: 'id',
    description: 'Recommendation session identifier',
    example: ids.recommendation,
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendation session returned successfully',
    schema: { example: recommendationSessionExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Recommendation not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Recommendation not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: User) {
    const recommendation = await this.recommendationsService.findOne(params.id);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      recommendation.organizationId
    );

    if (
      recommendation.userId === user.id &&
      hasPermission(membership.role, 'recommendations.viewOwn')
    ) {
      return recommendation;
    }

    this.authorizationService.assertPermission(
      membership,
      'recommendations.view'
    );
    return recommendation;
  }
}
