import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuditsModule } from './audits/audits.module';
import { ComponentsModule } from './components/components.module';
import { GuardrailsModule } from './guardrails/guardrails.module';
import { OrganizationInvitesModule } from './organization-invites/organization-invites.module';
import { OrganizationMembersModule } from './organization-members/organization-members.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { PromptsModule } from './prompts/prompts.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { UsersModule } from './users/users.module';
import { apiEnvFilePath, validateEnv } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: apiEnvFilePath,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    AuthorizationModule,
    UsersModule,
    OrganizationsModule,
    OrganizationMembersModule,
    OrganizationInvitesModule,
    ProjectsModule,
    ComponentsModule,
    GuardrailsModule,
    PromptsModule,
    AiModule,
    AuditsModule,
    RecommendationsModule,
  ],
})
export class AppModule {}
