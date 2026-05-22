import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  auditExample,
  ids,
  prNoteExample,
  recommendationExample,
  setupGuidanceExample,
} from '../common/swagger/api-examples';
import { AiService } from './ai.service';
import { AuditDto } from './dto/audit.dto';
import { GeneratePrNoteDto } from './dto/generate-pr-note.dto';
import { RecommendComponentDto } from './dto/recommend-component.dto';
import { SetupGuidanceDto } from './dto/setup-guidance.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend-component')
  @ApiOperation({
    summary: 'Recommend component',
    description:
      'Recommends one documented component based on the organization catalog, guardrails, and user goal.',
  })
  @ApiBody({
    type: RecommendComponentDto,
    examples: {
      recommendComponent: {
        summary: 'Recommend a destructive action component',
        value: {
          organizationId: ids.organization,
          projectId: ids.project,
          userId: ids.user,
          userGoal:
            'I need a destructive confirmation action in a settings panel.',
          context: {
            surface: 'settings panel',
            riskLevel: 'high',
            framework: 'React',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Recommendation generated successfully',
    schema: { example: recommendationExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Organization has no component catalog or validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: 'Organization has no component catalog',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization or project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Project not found for organization',
        error: 'Not Found',
      },
    },
  })
  recommendComponent(@Body() dto: RecommendComponentDto) {
    return this.aiService.recommendComponent(dto);
  }

  @Post('audit')
  @ApiOperation({
    summary: 'Audit UI submission',
    description:
      'Audits JSX, implementation plans, or diffs against organization guardrails and component rules.',
  })
  @ApiBody({
    type: AuditDto,
    examples: {
      auditJsx: {
        summary: 'Audit JSX before a PR',
        value: {
          organizationId: ids.organization,
          projectId: ids.project,
          userId: ids.user,
          auditType: 'pre-pr',
          inputType: 'jsx',
          content: '<button className="icon-btn"><TrashIcon /></button>',
          categories: ['accessibility', 'component-usage'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Audit completed successfully',
    schema: { example: auditExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Organization has no component catalog or validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['inputType must be one of the following values: jsx, plan, diff'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Organization or project not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Organization not found',
        error: 'Not Found',
      },
    },
  })
  audit(@Body() dto: AuditDto) {
    return this.aiService.audit(dto);
  }

  @Post('setup-guidance')
  @ApiOperation({
    summary: 'Generate setup guidance',
    description:
      'Generates setup instructions for adopting the design system in a project.',
  })
  @ApiBody({
    type: SetupGuidanceDto,
    examples: {
      setupGuidance: {
        summary: 'Generate Next.js setup guidance',
        value: {
          organizationId: ids.organization,
          framework: 'Next.js',
          packageManager: 'npm',
          typescript: true,
          storybook: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Setup guidance generated successfully',
    schema: { example: setupGuidanceExample },
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
  setupGuidance(@Body() dto: SetupGuidanceDto) {
    return this.aiService.setupGuidance(dto);
  }

  @Post('generate-pr-note')
  @ApiOperation({
    summary: 'Generate PR note',
    description:
      'Generates a pull request note from recommendation, audit, and optional caller context.',
  })
  @ApiBody({
    type: GeneratePrNoteDto,
    examples: {
      generatePrNote: {
        summary: 'Generate a PR note from AI sessions',
        value: {
          organizationId: ids.organization,
          recommendationId: ids.recommendation,
          auditId: ids.audit,
          context:
            'This PR replaces a custom destructive button with the design-system Button component.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'PR note generated successfully',
    schema: { example: prNoteExample },
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
  generatePrNote(@Body() dto: GeneratePrNoteDto) {
    return this.aiService.generatePrNote(dto);
  }
}
