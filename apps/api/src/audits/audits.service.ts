import { Injectable, NotFoundException } from '@nestjs/common';
import type { AuditFinding, AuditSession } from '@prisma/client';
import type {
  AuditFindingResponse,
  AuditSessionSummary,
} from '@winniekagendo/componentiq-shared-types';

import { PrismaService } from '../prisma/prisma.service';

type AuditSessionWithFindings = AuditSession & { findings: AuditFinding[] };

@Injectable()
export class AuditsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(
    organizationId: string,
    userId?: string,
    projectId?: string
  ): Promise<AuditSessionSummary[]> {
    await this.ensureOrganization(organizationId);

    const sessions = await this.prisma.auditSession.findMany({
      where: {
        organizationId,
        ...(userId ? { userId } : {}),
        ...(projectId ? { projectId } : {}),
      },
      include: { findings: true },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(mapAuditSessionSummary);
  }

  async findOne(id: string): Promise<AuditSessionWithFindings> {
    const audit = await this.prisma.auditSession.findUnique({
      where: { id },
      include: { findings: true },
    });

    if (!audit) {
      throw new NotFoundException('Audit not found');
    }

    return audit;
  }

  private async ensureOrganization(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
  }
}

export function mapAuditSessionSummary(
  session: AuditSessionWithFindings
): AuditSessionSummary {
  return {
    id: session.id,
    projectId: session.projectId,
    auditType: session.auditType,
    inputType: session.inputType as AuditSessionSummary['inputType'],
    status: mapAuditStatus(session.status),
    summary: session.summary,
    createdAt: session.createdAt.toISOString(),
    findings: session.findings.map(mapAuditFinding),
  };
}

function mapAuditStatus(
  status: AuditSession['status']
): AuditSessionSummary['status'] {
  return status.toLowerCase() as AuditSessionSummary['status'];
}

function mapAuditFinding(finding: AuditFinding): AuditFindingResponse {
  return {
    severity: finding.severity.toLowerCase() as AuditFindingResponse['severity'],
    category: finding.category,
    issue: finding.issue,
    suggestion: finding.suggestion,
    ruleUsed: finding.ruleUsed ?? undefined,
    filePath: finding.filePath ?? undefined,
    lineNumber: finding.lineNumber ?? undefined,
    docsLink: finding.docsLink ?? undefined,
  };
}
