import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GuardrailsController } from './guardrails.controller';
import { GuardrailsService } from './guardrails.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [GuardrailsController],
  providers: [GuardrailsService],
})
export class GuardrailsModule {}
