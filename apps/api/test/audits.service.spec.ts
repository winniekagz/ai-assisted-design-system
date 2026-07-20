import { describe, expect, it, vi } from 'vitest';

import { AuditsService } from '../src/audits/audits.service';

const createdAt = new Date('2026-07-17T09:00:00.000Z');

function createPrismaMock() {
  return {
    organization: {
      findUnique: vi.fn().mockResolvedValue({ id: 'org_1' }),
    },
    auditSession: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
}

function createAuditSessionRecord(overrides: Partial<{
  id: string;
  organizationId: string;
  projectId: string | null;
  userId: string | null;
  auditType: string;
  inputType: string;
  status: 'PASSED' | 'NEEDS_CHANGES' | 'FAILED';
  summary: string;
}> = {}) {
  return {
    id: overrides.id ?? 'audit_1',
    organizationId: overrides.organizationId ?? 'org_1',
    projectId: overrides.projectId ?? 'project_1',
    userId: overrides.userId ?? 'user_1',
    auditType: overrides.auditType ?? 'manual',
    inputType: overrides.inputType ?? 'jsx',
    inputContent: '<button />',
    status: overrides.status ?? 'PASSED',
    summary: overrides.summary ?? 'No blocking findings.',
    rawResponse: { status: 'passed', summary: overrides.summary ?? 'No blocking findings.', findings: [] },
    createdAt,
    findings: [
      {
        id: 'finding_1',
        auditSessionId: overrides.id ?? 'audit_1',
        severity: 'HIGH',
        category: 'accessibility',
        issue: 'Icon button has no accessible name.',
        suggestion: 'Add an aria-label.',
        ruleUsed: 'icon-button-label',
        filePath: 'src/components/IconButton.tsx',
        lineNumber: 12,
        docsLink: null,
        createdAt,
      },
    ],
  };
}

describe('AuditsService', () => {
  it('scopes the audit list to the resolved organization', async () => {
    const prisma = createPrismaMock();
    const service = new AuditsService(prisma as never);

    await service.findByOrganization('org_1');

    expect(prisma.auditSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_1' },
      })
    );
  });

  it('filters by projectId when provided', async () => {
    const prisma = createPrismaMock();
    const service = new AuditsService(prisma as never);

    await service.findByOrganization('org_1', undefined, 'project_1');

    expect(prisma.auditSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_1', projectId: 'project_1' },
      })
    );
  });

  it('returns an empty list for a project outside the resolved organization instead of leaking other results', async () => {
    const prisma = createPrismaMock();
    prisma.auditSession.findMany.mockResolvedValue([]);
    const service = new AuditsService(prisma as never);

    const result = await service.findByOrganization(
      'org_a',
      undefined,
      'project_owned_by_org_b'
    );

    expect(prisma.auditSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_a', projectId: 'project_owned_by_org_b' },
      })
    );
    expect(result).toEqual([]);
  });

  it('narrows to the current user when the caller cannot view all organization audits', async () => {
    const prisma = createPrismaMock();
    const service = new AuditsService(prisma as never);

    await service.findByOrganization('org_1', 'user_1');

    expect(prisma.auditSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_1', userId: 'user_1' },
      })
    );
  });

  it('maps sessions to a safe summary shape without leaking rawResponse or full inputContent', async () => {
    const prisma = createPrismaMock();
    prisma.auditSession.findMany.mockResolvedValue([createAuditSessionRecord()]);
    const service = new AuditsService(prisma as never);

    const [summary] = await service.findByOrganization('org_1');

    expect(summary).toEqual({
      id: 'audit_1',
      projectId: 'project_1',
      auditType: 'manual',
      inputType: 'jsx',
      status: 'passed',
      summary: 'No blocking findings.',
      createdAt: createdAt.toISOString(),
      findings: [
        {
          severity: 'high',
          category: 'accessibility',
          issue: 'Icon button has no accessible name.',
          suggestion: 'Add an aria-label.',
          ruleUsed: 'icon-button-label',
          filePath: 'src/components/IconButton.tsx',
          lineNumber: 12,
          docsLink: undefined,
        },
      ],
    });
    expect(summary).not.toHaveProperty('rawResponse');
    expect(summary).not.toHaveProperty('inputContent');
  });
});
