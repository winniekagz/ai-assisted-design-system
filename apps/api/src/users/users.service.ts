import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(user: User) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      user,
      memberships: memberships.map(membership => ({
        id: membership.id,
        role: membership.role,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
        organization: membership.organization,
      })),
    };
  }
}
