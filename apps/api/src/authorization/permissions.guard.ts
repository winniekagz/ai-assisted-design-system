import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { AuthenticatedRequest } from '../auth/auth.types';
import { AuthorizationService } from './authorization.service';
import type { Permission } from './permissions';
import { REQUIRED_PERMISSION_KEY } from './require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.currentUser) {
      throw new UnauthorizedException('Authentication required');
    }

    const requiredPermission = this.reflector.getAllAndOverride<Permission>(
      REQUIRED_PERMISSION_KEY,
      [context.getHandler(), context.getClass()]
    );
    const orgIdentifier = this.authorizationService.getOrganizationIdentifier(
      request.params,
      request.body
    );

    if (!orgIdentifier) {
      return true;
    }

    const resolved =
      request.organization && request.membership
        ? { organization: request.organization, membership: request.membership }
        : await this.authorizationService.resolveMembership(
            request.currentUser,
            orgIdentifier
          );

    this.authorizationService.assertPermission(
      resolved.membership,
      requiredPermission
    );

    request.organization = resolved.organization;
    request.membership = resolved.membership;

    return true;
  }
}
