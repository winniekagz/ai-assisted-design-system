import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, owner: User) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    try {
      return await this.prisma.organization.create({
        data: {
          name: dto.name,
          slug,
          members: {
            create: {
              userId: owner.id,
              role: 'OWNER',
            },
          },
        },
        include: {
          members: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Organization slug is already in use');
      }

      throw error;
    }
  }

  async findAllForUser(user: User) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId: user.id },
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map(membership => ({
      ...membership.organization,
      currentUserRole: membership.role,
      membershipId: membership.id,
    }));
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        guardrails: true,
        components: { include: { rules: true } },
        projects: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findByIdOrSlug(idOrSlug: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        guardrails: true,
        components: { include: { rules: true } },
        projects: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
