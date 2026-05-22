import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { CreateComponentRuleDto } from './dto/create-component-rule.dto';

@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateComponentDto) {
    await this.ensureOrganization(organizationId);

    return this.prisma.component.create({
      data: {
        organizationId,
        ...dto,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    await this.ensureOrganization(organizationId);

    return this.prisma.component.findMany({
      where: { organizationId },
      include: { rules: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const component = await this.prisma.component.findUnique({
      where: { id },
      include: { rules: true },
    });

    if (!component) {
      throw new NotFoundException('Component not found');
    }

    return component;
  }

  async createRule(componentId: string, dto: CreateComponentRuleDto) {
    await this.ensureComponent(componentId);

    return this.prisma.componentRule.create({
      data: {
        componentId,
        ...dto,
      },
    });
  }

  async findRules(componentId: string) {
    await this.ensureComponent(componentId);

    return this.prisma.componentRule.findMany({
      where: { componentId },
      orderBy: { createdAt: 'asc' },
    });
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

  private async ensureComponent(componentId: string) {
    const component = await this.prisma.component.findUnique({
      where: { id: componentId },
      select: { id: true },
    });

    if (!component) {
      throw new NotFoundException('Component not found');
    }
  }
}
