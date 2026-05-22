import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ids, organizationExample } from '../common/swagger/api-examples';
import { IdParamDto } from '../common/dto/id-param.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
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
  findAll() {
    return this.organizationsService.findAll();
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
  findOne(@Param() params: IdParamDto) {
    return this.organizationsService.findOne(params.id);
  }
}
