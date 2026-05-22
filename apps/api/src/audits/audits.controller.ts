import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import { auditSessionExample, ids } from '../common/swagger/api-examples';
import { AuditsService } from './audits.service';

@ApiTags('Audits')
@Controller()
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Get('organizations/:orgId/audits')
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
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.auditsService.findByOrganization(params.orgId);
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
  findOne(@Param() params: IdParamDto) {
    return this.auditsService.findOne(params.id);
  }
}
