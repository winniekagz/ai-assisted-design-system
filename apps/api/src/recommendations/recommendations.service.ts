import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    await this.ensureOrganization(organizationId);

    return this.prisma.recommendationSession.findMany({
      where: { organizationId },
      include: { alternatives: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const recommendation = await this.prisma.recommendationSession.findUnique({
      where: { id },
      include: { alternatives: true },
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    return recommendation;
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
