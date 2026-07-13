import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { describeDatabaseUrl } from '../config/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly config: ConfigService) {
    super();
  }

  async onModuleInit() {
    const databaseUrl = this.config.getOrThrow<string>('DATABASE_URL');
    const target = describeDatabaseUrl(databaseUrl);
    this.logger.log(
      `Connecting to PostgreSQL host=${target.host} port=${target.port} database=${target.database} passwordPresent=${target.passwordPresent}`
    );
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
