import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, ClerkAuthGuard],
  exports: [AuthService, ClerkAuthGuard],
})
export class AuthModule {}
