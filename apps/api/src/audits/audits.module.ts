import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [AuditsController],
  providers: [AuditsService],
})
export class AuditsModule {}
