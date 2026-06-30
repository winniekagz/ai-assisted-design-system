import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthorizationService } from '../authorization/authorization.service';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { guardrailExample, ids } from '../common/swagger/api-examples';
import { CreateGuardrailDto } from './dto/create-guardrail.dto';
import { UpdateGuardrailDto } from './dto/update-guardrail.dto';
import { GuardrailsService } from './guardrails.service';
import type { User } from '@prisma/client';

@ApiTags('Guardrails')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class GuardrailsController {
  constructor(
    private readonly guardrailsService: GuardrailsService,
    private readonly authorizationService: AuthorizationService
  ) {}

  @Post('organizations/:orgId/guardrails')
  @RequirePermission('guardrails.manage')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create guardrail',
    description: 'Creates an organization-level design-system guardrail.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiBody({
    type: CreateGuardrailDto,
    examples: {
      createGuardrail: {
        summary: 'Create an accessibility guardrail',
        value: {
          category: 'ACCESSIBILITY',
          title: 'Interactive controls need accessible names',
          ruleText:
            'Every interactive icon-only control must provide an aria-label or visible text.',
          severity: 'HIGH',
          enabled: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Guardrail created successfully',
    schema: { example: guardrailExample },
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
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateGuardrailDto) {
    return this.guardrailsService.create(params.orgId, dto);
  }

  @Get('organizations/:orgId/guardrails')
  @RequirePermission('guardrails.view')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'List organization guardrails',
    description:
      'Returns guardrails for an organization ordered by enabled state, category, and title.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Guardrails returned successfully',
    schema: { example: [guardrailExample] },
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
    return this.guardrailsService.findByOrganization(params.orgId);
  }

  @Patch('guardrails/:id')
  @ApiOperation({
    summary: 'Update guardrail',
    description: 'Updates editable fields for an existing guardrail.',
  })
  @ApiParam({
    name: 'id',
    description: 'Guardrail identifier',
    example: ids.guardrail,
  })
  @ApiBody({
    type: UpdateGuardrailDto,
    examples: {
      updateGuardrail: {
        summary: 'Disable a guardrail',
        value: {
          enabled: false,
          severity: 'MEDIUM',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Guardrail updated successfully',
    schema: {
      example: {
        ...guardrailExample,
        severity: 'MEDIUM',
        enabled: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Guardrail not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Guardrail not found',
        error: 'Not Found',
      },
    },
  })
  async update(
    @Param() params: IdParamDto,
    @CurrentUser() user: User,
    @Body() dto: UpdateGuardrailDto
  ) {
    const guardrail = await this.guardrailsService.findOne(params.id);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      guardrail.organizationId
    );
    this.authorizationService.assertPermission(membership, 'guardrails.manage');
    return this.guardrailsService.update(params.id, dto);
  }
}
