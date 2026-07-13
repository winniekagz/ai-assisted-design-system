import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../auth/auth.types';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class OrgMembershipGuard implements CanActivate {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.currentUser) {
      throw new UnauthorizedException('Authentication required');
    }

    const orgIdentifier = this.authorizationService.getOrganizationIdentifier(
      request.params,
      request.body
    );

    if (!orgIdentifier) {
      return true;
    }

    const { organization, membership } =
      await this.authorizationService.resolveMembership(
        request.currentUser,
        orgIdentifier
      );

    request.organization = organization;
    request.membership = membership;

    return true;
  }
}
