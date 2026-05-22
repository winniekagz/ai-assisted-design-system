import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from './ai/ai.module';
import { AuditsModule } from './audits/audits.module';
import { ComponentsModule } from './components/components.module';
import { GuardrailsModule } from './guardrails/guardrails.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { PromptsModule } from './prompts/prompts.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    OrganizationsModule,
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
