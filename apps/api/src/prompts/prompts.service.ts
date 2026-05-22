import { Injectable } from '@nestjs/common';
import { PromptType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  findActive(type: PromptType, organizationId?: string) {
    return this.prisma.promptTemplate.findFirst({
      where: {
        type,
        active: true,
        OR: [{ organizationId }, { organizationId: null }],
      },
      orderBy: [{ organizationId: 'desc' }, { version: 'desc' }],
    });
  }
}
