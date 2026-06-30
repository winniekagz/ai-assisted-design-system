import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';

@Module({
  imports: [AuthModule, AuthorizationModule, PrismaModule],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {}
