import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.authService.verifyAndSyncUser(token);
    request.currentUser = user;
    request.clerkUserId = user.clerkUserId ?? undefined;

    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest) {
    const header = request.headers.authorization;
    const value = Array.isArray(header) ? header[0] : header;

    if (!value?.startsWith('Bearer ')) {
      return null;
    }

    return value.slice('Bearer '.length).trim();
  }
}
