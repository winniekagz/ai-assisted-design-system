import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrganizationInvitesController } from './organization-invites.controller';
import { OrganizationInvitesService } from './organization-invites.service';

@Module({
  imports: [AuthModule, AuthorizationModule, EmailModule, PrismaModule],
  controllers: [OrganizationInvitesController],
  providers: [OrganizationInvitesService],
})
export class OrganizationInvitesModule {}
