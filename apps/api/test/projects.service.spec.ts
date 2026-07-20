import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import { AuthorizationService } from '../src/authorization/authorization.service';
import { ProjectsService } from '../src/projects/projects.service';

const createdAt = new Date('2026-07-17T09:00:00.000Z');
const updatedAt = new Date('2026-07-17T09:30:00.000Z');

function createPrismaMock() {
  return {
    organization: {
      findUnique: vi.fn().mockResolvedValue({ id: 'org_1' }),
    },
    project: {
      create: vi.fn().mockResolvedValue({
        id: 'project_1',
        name: 'Checkout Platform',
        slug: 'checkout-platform',
        description: 'Customer checkout product',
        framework: 'Not configured',
        packageManager: 'Not configured',
        stylingSystem: 'Not configured',
        configurationStatus: 'NOT_CONFIGURED',
        repositoryUrl: null,
        createdAt,
        updatedAt,
      }),
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
}

type ProjectRecordOverrides = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  framework?: string;
  packageManager?: string;
  stylingSystem?: string;
  configurationStatus?: 'NOT_CONFIGURED' | 'CONFIGURING' | 'REVIEW_REQUIRED' | 'READY' | 'CONFIGURATION_FAILED' | 'ARCHIVED';
  repositoryUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

function createProjectRecord(overrides: ProjectRecordOverrides = {}) {
  return {
    id: overrides.id ?? 'project_1',
    name: overrides.name ?? 'Checkout Platform',
    slug: overrides.slug ?? 'checkout-platform',
    description: overrides.description ?? null,
    framework: overrides.framework ?? 'Not configured',
    packageManager: overrides.packageManager ?? 'Not configured',
    stylingSystem: overrides.stylingSystem ?? 'Not configured',
    configurationStatus: overrides.configurationStatus ?? 'NOT_CONFIGURED',
    repositoryUrl: overrides.repositoryUrl ?? null,
    createdAt: overrides.createdAt ?? createdAt,
    updatedAt: overrides.updatedAt ?? updatedAt,
  };
}

describe('ProjectsService', () => {
  it('creates a project in the resolved organization with normalized input', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectsService(prisma as never);

    const project = await service.create({
      organizationId: 'resolved_org',
      actorUserId: 'user_1',
      input: {
        name: '  Checkout Platform  ',
        description: '  Customer checkout product  ',
      },
    });

    expect(prisma.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          organizationId: 'resolved_org',
          name: 'Checkout Platform',
          slug: 'checkout-platform',
          description: 'Customer checkout product',
        }),
      })
    );
    expect(project).toEqual({
      id: 'project_1',
      name: 'Checkout Platform',
      slug: 'checkout-platform',
      description: 'Customer checkout product',
      framework: 'Not configured',
      packageManager: 'Not configured',
      stylingSystem: 'Not configured',
      configurationStatus: 'NOT_CONFIGURED',
      repositoryUrl: null,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it('does not allow public input to choose the project organization', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.create({
        organizationId: 'resolved_org',
        actorUserId: 'user_1',
        input: {
          name: 'Checkout Platform',
          organizationId: 'attacker_org',
        } as never,
      })
    ).rejects.toThrow('Project input is invalid');
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('maps duplicate organization slug errors to a safe conflict', async () => {
    const prisma = createPrismaMock();
    prisma.project.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.22.0',
        meta: { target: ['organizationId', 'slug'] },
      })
    );
    const service = new ProjectsService(prisma as never);

    await expect(
      service.create({
        organizationId: 'resolved_org',
        actorUserId: 'user_1',
        input: { name: 'Checkout Platform' },
      })
    ).rejects.toThrow(ConflictException);
    await expect(
      service.create({
        organizationId: 'resolved_org',
        actorUserId: 'user_1',
        input: { name: 'Checkout Platform' },
      })
    ).rejects.toThrow(
      'A project with this name already exists in this organization.'
    );
  });

  it('returns organization-scoped projects sorted by updated date', async () => {
    const prisma = createPrismaMock();
    const firstUpdated = new Date('2026-07-17T11:00:00.000Z');
    const secondUpdated = new Date('2026-07-17T10:00:00.000Z');
    prisma.project.findMany.mockResolvedValue([
      createProjectRecord({
        id: 'project_new',
        name: 'Newer Project',
        slug: 'newer-project',
        description: 'Most recently updated',
        updatedAt: firstUpdated,
      }),
      createProjectRecord({
        id: 'project_old',
        name: 'Older Project',
        slug: 'older-project',
        updatedAt: secondUpdated,
      }),
    ]);
    const service = new ProjectsService(prisma as never);

    const projects = await service.findByOrganization('resolved_org');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { organizationId: 'resolved_org' },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      skip: 0,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        framework: true,
        packageManager: true,
        stylingSystem: true,
        repositoryUrl: true,
        configurationStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(projects).toEqual([
      expect.objectContaining({
        id: 'project_new',
        name: 'Newer Project',
        slug: 'newer-project',
        description: 'Most recently updated',
        updatedAt: firstUpdated.toISOString(),
      }),
      expect.objectContaining({
        id: 'project_old',
        name: 'Older Project',
        slug: 'older-project',
        description: null,
        updatedAt: secondUpdated.toISOString(),
      }),
    ]);
  });

  it('bounds project list queries and applies server-side filters', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectsService(prisma as never);

    await service.findByOrganization('resolved_org', {
      limit: 250,
      offset: 12,
      search: 'checkout',
      configurationStatus: 'READY',
    });

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 100,
        skip: 12,
        where: expect.objectContaining({
          organizationId: 'resolved_org',
          configurationStatus: 'READY',
          OR: expect.any(Array),
        }),
      })
    );
  });

  it('returns an empty array when the organization has no projects', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(service.findByOrganization('resolved_org')).resolves.toEqual([]);
  });

  it('does not query projects outside the resolved organization', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectsService(prisma as never);

    await service.findByOrganization('organization_a');

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'organization_a' },
      })
    );
    expect(prisma.project.findMany).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'organization_b' }),
      })
    );
  });
});

describe('AuthorizationService organization identifier resolution', () => {
  it('prefers route organization identifiers over body organizationId', () => {
    const service = new AuthorizationService({} as never);

    expect(
      service.getOrganizationIdentifier(
        { orgId: 'resolved-org' },
        { organizationId: 'attacker-org' }
      )
    ).toBe('resolved-org');
  });
});
