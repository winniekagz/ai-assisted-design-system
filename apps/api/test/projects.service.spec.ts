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
        repositoryUrl: null,
        createdAt,
        updatedAt,
      }),
      findMany: vi.fn().mockResolvedValue([]),
    },
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
