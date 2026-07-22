import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GithubAppConfigService } from './github-app-config.service';
import { GithubConnectionStateService } from './github-connection-state.service';
import { GithubIntegrationsController } from './github-integrations.controller';
import { GithubIntegrationService } from './github-integration.service';
import { GithubRepositoryService } from './github-repository.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [GithubIntegrationsController],
  providers: [
    GithubAppConfigService,
    GithubConnectionStateService,
    GithubIntegrationService,
    GithubRepositoryService,
  ],
})
export class IntegrationsModule {}
