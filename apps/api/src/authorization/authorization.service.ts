import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Organization, OrganizationMember, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { hasPermission, type Permission } from './permissions';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrganizationByIdOrSlug(idOrSlug: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async resolveMembership(user: User, idOrSlug: string) {
    const organization = await this.findOrganizationByIdOrSlug(idOrSlug);
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organization.id,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Organization access denied');
    }

    return { organization, membership };
  }

  assertPermission(membership: OrganizationMember, permission?: Permission) {
    if (!permission) {
      return;
    }

    if (!hasPermission(membership.role, permission)) {
      throw new ForbiddenException('You do not have permission to access this area');
    }
  }

  getOrganizationIdentifier(
    params?: Record<string, string | string[] | undefined>,
    body?: Record<string, unknown>
  ) {
    const identifier =
      params?.orgId ??
      params?.orgSlug ??
      (typeof body?.organizationId === 'string' ? body.organizationId : undefined);

    return Array.isArray(identifier) ? identifier[0] : identifier;
  }
}

export type AuthorizedOrganizationContext = {
  organization: Organization;
  membership: OrganizationMember;
};
