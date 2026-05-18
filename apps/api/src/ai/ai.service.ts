import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditStatus, Severity } from '@prisma/client';
import type {
  AuditResponse,
  GeneratePrNoteResponse,
  RecommendComponentResponse,
  SetupGuidanceResponse,
} from '@winniekagendo/componentiq-shared-types';

import { PrismaService } from '../prisma/prisma.service';
import { AuditDto } from './dto/audit.dto';
import { GeneratePrNoteDto } from './dto/generate-pr-note.dto';
import { RecommendComponentDto } from './dto/recommend-component.dto';
import { SetupGuidanceDto } from './dto/setup-guidance.dto';
import { auditResponseSchema } from './schemas/audit.schema';
import { recommendationResponseSchema } from './schemas/recommendation.schema';
import {
  AI_PROVIDER,
  AiProvider,
  AiProviderResult,
} from './providers/ai-provider.interface';

const SYSTEM_PROMPT =
  'You are a design-system review assistant. Review based only on the provided organization rules, component catalog, and guardrails. Do not invent undocumented components or rules. If rules are missing, say what is missing. Return structured JSON only.';

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER) private readonly aiProvider: AiProvider
  ) {}

  async recommendComponent(
    dto: RecommendComponentDto
  ): Promise<RecommendComponentResponse> {
    const context = await this.loadOrganizationContext(
      dto.organizationId,
      dto.projectId
    );
    const prompt = this.buildRecommendationPrompt(dto, context);
    const providerResult = await this.aiProvider.completeJson({
      feature: 'component_recommendation',
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: prompt,
    });
    const response = recommendationResponseSchema.parse(providerResult.raw);

    const session = await this.prisma.recommendationSession.create({
      data: {
        organizationId: dto.organizationId,
        projectId: dto.projectId,
        userId: dto.userId,
        userGoal: dto.userGoal,
        recommendedComponent: response.recommendedComponent,
        confidence: response.confidence,
        reasoning: response.reason,
        prNote: response.prNote,
        rawResponse: response,
        alternatives: {
          create: response.alternatives.map(alternative => ({
            componentName: alternative.component,
            reason: alternative.reason,
            tradeoff: alternative.tradeoff,
          })),
        },
      },
      include: { alternatives: true },
    });

    await this.logUsage(
      dto.organizationId,
      dto.userId,
      'component_recommendation',
      providerResult
    );

    return {
      id: session.id,
      recommendedComponent: response.recommendedComponent,
      confidence: response.confidence,
      reason: response.reason,
      guardrails: response.guardrails,
      alternatives: response.alternatives,
      prNote: response.prNote,
    };
  }

  async audit(dto: AuditDto): Promise<AuditResponse> {
    const context = await this.loadOrganizationContext(
      dto.organizationId,
      dto.projectId
    );
    const prompt = this.buildAuditPrompt(dto, context);
    const providerResult = await this.aiProvider.completeJson({
      feature: 'pre_pr_audit',
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: prompt,
    });
    const response = auditResponseSchema.parse(providerResult.raw);

    const auditSession = await this.prisma.auditSession.create({
      data: {
        organizationId: dto.organizationId,
        projectId: dto.projectId,
        userId: dto.userId,
        auditType: dto.auditType,
        inputType: dto.inputType,
        inputContent: dto.content,
        status: this.toAuditStatus(response.status),
        summary: response.summary,
        rawResponse: response,
        findings: {
          create: response.findings.map(finding => ({
            severity: this.toSeverity(finding.severity),
            category: finding.category,
            issue: finding.issue,
            suggestion: finding.suggestion,
            ruleUsed: finding.ruleUsed,
            filePath: finding.filePath,
            lineNumber: finding.lineNumber,
            docsLink: finding.docsLink,
          })),
        },
      },
      include: { findings: true },
    });

    await this.logUsage(
      dto.organizationId,
      dto.userId,
      'pre_pr_audit',
      providerResult
    );

    return {
      id: auditSession.id,
      status: response.status,
      summary: response.summary,
      findings: response.findings,
    };
  }

  async setupGuidance(dto: SetupGuidanceDto): Promise<SetupGuidanceResponse> {
    const context = await this.loadOrganizationContext(dto.organizationId);
    const providerResult = await this.aiProvider.completeJson({
      feature: 'setup_guidance',
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: JSON.stringify({
        request: dto,
        organization: context.organization,
        guardrails: context.guardrails,
      }),
    });

    await this.logUsage(
      dto.organizationId,
      undefined,
      'setup_guidance',
      providerResult
    );

    return providerResult.raw as SetupGuidanceResponse;
  }

  async generatePrNote(
    dto: GeneratePrNoteDto
  ): Promise<GeneratePrNoteResponse> {
    await this.loadOrganizationContext(dto.organizationId);
    const providerResult = await this.aiProvider.completeJson({
      feature: 'pr_note',
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: JSON.stringify(dto),
    });

    await this.logUsage(
      dto.organizationId,
      undefined,
      'pr_note',
      providerResult
    );

    return providerResult.raw as GeneratePrNoteResponse;
  }

  private async loadOrganizationContext(
    organizationId: string,
    projectId?: string
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        guardrails: { where: { enabled: true } },
        components: { include: { rules: true }, orderBy: { name: 'asc' } },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const project = projectId
      ? await this.prisma.project.findFirst({
          where: { id: projectId, organizationId },
        })
      : null;

    if (projectId && !project) {
      throw new NotFoundException('Project not found for organization');
    }

    if (organization.components.length === 0) {
      throw new BadRequestException('Organization has no component catalog');
    }

    return { organization, project, guardrails: organization.guardrails };
  }

  private buildRecommendationPrompt(
    dto: RecommendComponentDto,
    context: Awaited<ReturnType<AiService['loadOrganizationContext']>>
  ) {
    return JSON.stringify({
      task: 'Recommend one documented component and explain the organization rules used.',
      userGoal: dto.userGoal,
      requestContext: dto.context ?? {},
      organization: {
        id: context.organization.id,
        name: context.organization.name,
      },
      project: context.project,
      guardrails: context.guardrails,
      components: context.organization.components,
      expectedShape: {
        recommendedComponent: 'string',
        confidence: 'low | medium | high',
        reason: 'string',
        guardrails: ['string'],
        alternatives: [
          { component: 'string', reason: 'string', tradeoff: 'string' },
        ],
        prNote: 'string',
      },
    });
  }

  private buildAuditPrompt(
    dto: AuditDto,
    context: Awaited<ReturnType<AiService['loadOrganizationContext']>>
  ) {
    return JSON.stringify({
      task: 'Audit the submitted UI against organization guardrails and component rules.',
      auditType: dto.auditType,
      inputType: dto.inputType,
      categories: dto.categories,
      content: dto.content,
      organization: {
        id: context.organization.id,
        name: context.organization.name,
      },
      project: context.project,
      guardrails: context.guardrails,
      components: context.organization.components,
      expectedShape: {
        status: 'passed | needs_changes | failed',
        summary: 'string',
        findings: [
          {
            severity: 'low | medium | high | critical',
            category: 'string',
            issue: 'string',
            suggestion: 'string',
            ruleUsed: 'string',
            filePath: 'string',
            lineNumber: 'number',
            docsLink: 'string',
          },
        ],
      },
    });
  }

  private toAuditStatus(status: string): AuditStatus {
    if (status === 'passed') return AuditStatus.PASSED;
    if (status === 'failed') return AuditStatus.FAILED;
    return AuditStatus.NEEDS_CHANGES;
  }

  private toSeverity(severity: string): Severity {
    const normalized = severity.toUpperCase();
    if (normalized in Severity) {
      return Severity[normalized as keyof typeof Severity];
    }

    return Severity.MEDIUM;
  }

  private async logUsage(
    organizationId: string | undefined,
    userId: string | undefined,
    feature: string,
    providerResult: AiProviderResult
  ) {
    await this.prisma.aiUsageLog.create({
      data: {
        organizationId,
        userId,
        feature,
        model: providerResult.model,
        inputTokens: providerResult.inputTokens,
        outputTokens: providerResult.outputTokens,
        latencyMs: providerResult.latencyMs,
      },
    });
  }
}
