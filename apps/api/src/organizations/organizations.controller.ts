import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { OrganizationMember, User } from '@prisma/client';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthorizationService } from '../authorization/authorization.service';
import { CurrentMembership } from '../authorization/current-membership.decorator';
import { OrgMembershipGuard } from '../authorization/org-membership.guard';
import { ids, organizationExample } from '../common/swagger/api-examples';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly authorizationService: AuthorizationService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create organization',
    description:
      'Creates a design-system organization and generates a slug when one is not provided.',
  })
  @ApiBody({
    type: CreateOrganizationDto,
    examples: {
      createOrganization: {
        summary: 'Create an organization',
        value: {
          name: 'Acme Design System',
          slug: 'acme-design-system',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    schema: { example: organizationExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['name must be longer than or equal to 2 characters'],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: User) {
    return this.organizationsService.create(dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'List organizations',
    description: 'Returns all organizations ordered by newest first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations returned successfully',
    schema: { example: [organizationExample] },
  })
  findAll(@CurrentUser() user: User) {
    return this.organizationsService.findAllForUser(user);
  }

  @Get('slug/:orgSlug')
  @UseGuards(OrgMembershipGuard)
  @ApiOperation({
    summary: 'Get organization by slug',
    description:
      'Returns one organization by slug when the authenticated user is a member.',
  })
  @ApiParam({
    name: 'orgSlug',
    description: 'Organization slug',
    example: 'acme-design-system',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization returned successfully',
    schema: {
      example: {
        ...organizationExample,
        guardrails: [],
        components: [],
        projects: [],
      },
    },
  })
  async findBySlug(
    @Param('orgSlug') orgSlug: string,
    @CurrentMembership() membership: OrganizationMember
  ) {
    const organization = await this.organizationsService.findByIdOrSlug(orgSlug);

    return {
      ...organization,
      currentUserRole: membership.role,
      membershipId: membership.id,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization',
    description:
      'Returns one organization with guardrails, projects, components, and component rules.',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Organization returned successfully',
    schema: {
      example: {
        ...organizationExample,
        guardrails: [],
        components: [],
        projects: [],
      },
    },
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
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: User) {
    await this.authorizationService.resolveMembership(user, params.id);
    return this.organizationsService.findOne(params.id);
  }
}
