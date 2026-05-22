import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    await this.ensureOrganization(organizationId);

    return this.prisma.auditSession.findMany({
      where: { organizationId },
      include: { findings: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
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
