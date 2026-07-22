import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { GithubAppConfigService } from '../integrations/github-app-config.service';
import { GithubRepositoryService } from '../integrations/github-repository.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GithubProjectImportService } from './github-project-import.service';
import { LocalProjectImportService } from './local-project-import.service';
import { LocalSourceStorageService } from './local-source-storage.service';
import { ProjectConfigurationService } from './project-configuration.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [ProjectsController],
  providers: [
    LocalProjectImportService,
    GithubProjectImportService,
    GithubAppConfigService,
    GithubRepositoryService,
    LocalSourceStorageService,
    ProjectConfigurationService,
    ProjectsService,
  ],
})
export class ProjectsModule {}
