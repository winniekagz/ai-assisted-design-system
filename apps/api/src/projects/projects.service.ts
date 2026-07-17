import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  createProjectSchema,
  type CreateProjectInput,
  type ProjectListItem,
} from '@winniekagendo/componentiq-shared-types';

import { slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';

const NOT_CONFIGURED = 'Not configured';

export type CreateProjectCommand = {
  organizationId: string;
  actorUserId: string;
  input: CreateProjectInput;
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateProjectCommand): Promise<ProjectListItem> {
    await this.ensureOrganization(command.organizationId);

    const parsed = createProjectSchema.safeParse(command.input);

    if (!parsed.success) {
      throw new BadRequestException('Project input is invalid');
    }

    const name = parsed.data.name;
    const description = parsed.data.description ?? null;

    try {
      const project = await this.prisma.project.create({
        data: {
          organizationId: command.organizationId,
          name,
          slug: slugify(name),
          description,
          framework: NOT_CONFIGURED,
          packageManager: NOT_CONFIGURED,
          stylingSystem: NOT_CONFIGURED,
        },
        select: projectListSelect,
      });

      void command.actorUserId;

      return mapProjectListItem(project);
    } catch (error) {
      if (isProjectSlugConflict(error)) {
        throw new ConflictException(
          'A project with this name already exists in this organization.'
        );
      }

      throw error;
    }
  }

  async findByOrganization(organizationId: string): Promise<ProjectListItem[]> {
    await this.ensureOrganization(organizationId);

    const projects = await this.prisma.project.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
      select: projectListSelect,
    });

    return projects.map(mapProjectListItem);
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

const projectListSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  framework: true,
  packageManager: true,
  stylingSystem: true,
  repositoryUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

type SelectedProject = Prisma.ProjectGetPayload<{
  select: typeof projectListSelect;
}>;

function mapProjectListItem(project: SelectedProject): ProjectListItem {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    framework: project.framework,
    packageManager: project.packageManager,
    stylingSystem: project.stylingSystem,
    repositoryUrl: project.repositoryUrl,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

function isProjectSlugConflict(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002' &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes('organizationId') &&
    error.meta.target.includes('slug')
  );
}
