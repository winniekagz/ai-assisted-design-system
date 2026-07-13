import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthorizationService } from './authorization.service';
import { OrgMembershipGuard } from './org-membership.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
  imports: [PrismaModule],
  providers: [AuthorizationService, OrgMembershipGuard, PermissionsGuard],
  exports: [AuthorizationService, OrgMembershipGuard, PermissionsGuard],
})
export class AuthorizationModule {}
