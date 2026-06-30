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
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthorizationService } from '../authorization/authorization.service';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { RequirePermission } from '../authorization/require-permission.decorator';
import {
  ComponentIdParamDto,
  IdParamDto,
  OrgIdParamDto,
} from '../common/dto/id-param.dto';
import {
  componentExample,
  componentRuleExample,
  componentWithRulesExample,
  ids,
} from '../common/swagger/api-examples';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { CreateComponentRuleDto } from './dto/create-component-rule.dto';
import type { User } from '@prisma/client';

@ApiTags('Components')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller()
export class ComponentsController {
  constructor(
    private readonly componentsService: ComponentsService,
    private readonly authorizationService: AuthorizationService
  ) {}

  @Post('organizations/:orgId/components')
  @RequirePermission('components.manage')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create component',
    description: 'Adds a documented component to an organization catalog.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiBody({
    type: CreateComponentDto,
    examples: {
      createComponent: {
        summary: 'Create a Button catalog entry',
        value: {
          name: 'Button',
          description:
            'Primary interaction component for actions and form submission.',
          category: 'Inputs',
          docsUrl: 'https://design.acme.com/components/button',
          storybookUrl:
            'https://storybook.acme.com/?path=/docs/components-button--docs',
          status: 'stable',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Component created successfully',
    schema: { example: componentExample },
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
  create(@Param() params: OrgIdParamDto, @Body() dto: CreateComponentDto) {
    return this.componentsService.create(params.orgId, dto);
  }

  @Get('organizations/:orgId/components')
  @RequirePermission('components.view')
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'List organization components',
    description:
      'Returns catalog components for an organization with their component-specific rules.',
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization identifier',
    example: ids.organization,
  })
  @ApiResponse({
    status: 200,
    description: 'Components returned successfully',
    schema: { example: [componentWithRulesExample] },
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
    return this.componentsService.findByOrganization(params.orgId);
  }

  @Get('components/:id')
  @ApiOperation({
    summary: 'Get component',
    description: 'Returns a single component with its component-specific rules.',
  })
  @ApiParam({
    name: 'id',
    description: 'Component identifier',
    example: ids.component,
  })
  @ApiResponse({
    status: 200,
    description: 'Component returned successfully',
    schema: { example: componentWithRulesExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Component not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Component not found',
        error: 'Not Found',
      },
    },
  })
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: User) {
    const component = await this.componentsService.findOne(params.id);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      component.organizationId
    );
    this.authorizationService.assertPermission(membership, 'components.view');
    return component;
  }

  @Post('components/:componentId/rules')
  @ApiOperation({
    summary: 'Create component rule',
    description: 'Adds a usage rule to a documented component.',
  })
  @ApiParam({
    name: 'componentId',
    description: 'Component identifier',
    example: ids.component,
  })
  @ApiBody({
    type: CreateComponentRuleDto,
    examples: {
      createComponentRule: {
        summary: 'Create an accessibility rule',
        value: {
          ruleType: 'accessibility',
          ruleText: 'Icon-only buttons must include an accessible label.',
          severity: 'HIGH',
          exampleGood: '<Button aria-label="Close"><XIcon /></Button>',
          exampleBad: '<Button><XIcon /></Button>',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Component rule created successfully',
    schema: { example: componentRuleExample },
  })
  @ApiResponse({
    status: 404,
    description: 'Component not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Component not found',
        error: 'Not Found',
      },
    },
  })
  async createRule(
    @Param() params: ComponentIdParamDto,
    @CurrentUser() user: User,
    @Body() dto: CreateComponentRuleDto
  ) {
    const component = await this.componentsService.findOne(params.componentId);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      component.organizationId
    );
    this.authorizationService.assertPermission(membership, 'components.manage');
    return this.componentsService.createRule(params.componentId, dto);
  }

  @Get('components/:componentId/rules')
  @ApiOperation({
    summary: 'List component rules',
    description: 'Returns all rules attached to a component ordered by creation date.',
  })
  @ApiParam({
    name: 'componentId',
    description: 'Component identifier',
    example: ids.component,
  })
  @ApiResponse({
    status: 200,
    description: 'Component rules returned successfully',
    schema: { example: [componentRuleExample] },
  })
  @ApiResponse({
    status: 404,
    description: 'Component not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Component not found',
        error: 'Not Found',
      },
    },
  })
  async findRules(@Param() params: ComponentIdParamDto, @CurrentUser() user: User) {
    const component = await this.componentsService.findOne(params.componentId);
    const { membership } = await this.authorizationService.resolveMembership(
      user,
      component.organizationId
    );
    this.authorizationService.assertPermission(membership, 'components.view');
    return this.componentsService.findRules(params.componentId);
  }
}
