import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OrganizationMembersController } from './organization-members.controller';
import { OrganizationMembersService } from './organization-members.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [OrganizationMembersController],
  providers: [OrganizationMembersService],
})
export class OrganizationMembersModule {}
