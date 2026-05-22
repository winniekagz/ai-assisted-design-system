import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IdParamDto, OrgIdParamDto } from '../common/dto/id-param.dto';
import {
  ids,
  recommendationSessionExample,
} from '../common/swagger/api-examples';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Get('organizations/:orgId/recommendations')
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
  findByOrganization(@Param() params: OrgIdParamDto) {
    return this.recommendationsService.findByOrganization(params.orgId);
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
  findOne(@Param() params: IdParamDto) {
    return this.recommendationsService.findOne(params.id);
  }
}
