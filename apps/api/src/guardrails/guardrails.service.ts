import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateGuardrailDto } from './dto/create-guardrail.dto';
import { UpdateGuardrailDto } from './dto/update-guardrail.dto';

@Injectable()
export class GuardrailsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateGuardrailDto) {
    await this.ensureOrganization(organizationId);

    return this.prisma.guardrail.create({
      data: {
        organizationId,
        enabled: dto.enabled ?? true,
        category: dto.category,
        title: dto.title,
        ruleText: dto.ruleText,
        severity: dto.severity,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    await this.ensureOrganization(organizationId);

    return this.prisma.guardrail.findMany({
      where: { organizationId },
      orderBy: [{ enabled: 'desc' }, { category: 'asc' }, { title: 'asc' }],
    });
  }

  async update(id: string, dto: UpdateGuardrailDto) {
    await this.ensureGuardrail(id);

    return this.prisma.guardrail.update({
      where: { id },
      data: dto,
    });
  }

  async findOne(id: string) {
    const guardrail = await this.prisma.guardrail.findUnique({
      where: { id },
    });

    if (!guardrail) {
      throw new NotFoundException('Guardrail not found');
    }

    return guardrail;
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

  private async ensureGuardrail(id: string) {
    const guardrail = await this.prisma.guardrail.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!guardrail) {
      throw new NotFoundException('Guardrail not found');
    }
  }
}
