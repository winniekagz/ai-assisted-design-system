import { Injectable, NotFoundException } from '@nestjs/common';

import { slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateProjectDto) {
    await this.ensureOrganization(organizationId);

    return this.prisma.project.create({
      data: {
        organizationId,
        name: dto.name,
        slug: dto.slug ? slugify(dto.slug) : slugify(dto.name),
        framework: dto.framework,
        packageManager: dto.packageManager,
        stylingSystem: dto.stylingSystem,
        repositoryUrl: dto.repositoryUrl,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    await this.ensureOrganization(organizationId);

    return this.prisma.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
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
}
