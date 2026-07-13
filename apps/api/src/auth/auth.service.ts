import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async verifyAndSyncUser(clerkSessionToken: string) {
    const secretKey = this.config.get<string>('CLERK_SECRET_KEY');

    if (!secretKey) {
      throw new UnauthorizedException('Authentication is not configured');
    }

    let clerkUserId: string;

    try {
      const payload = await verifyToken(clerkSessionToken, {
        secretKey,
        authorizedParties: this.getAuthorizedParties(),
      });
      clerkUserId = payload.sub;
    } catch (error) {
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        const message = error instanceof Error ? error.message : 'Unknown Clerk token error';
        this.logger.warn(
          `Clerk token verification failed: ${message}; ${this.describeTokenForDebug(
            clerkSessionToken
          )}`
        );
      }
      throw new UnauthorizedException('Invalid authentication token');
    }

    const clerkClient = createClerkClient({ secretKey });
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find(
      email => email.id === clerkUser.primaryEmailAddressId
    );
    const email = primaryEmail?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new UnauthorizedException('Authenticated user has no email address');
    }

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ clerkUserId }, { email: normalizedEmail }],
      },
    });

    if (existingUser) {
      if (existingUser.clerkUserId && existingUser.clerkUserId !== clerkUserId) {
        throw new UnauthorizedException('Authenticated email cannot be linked');
      }

      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          clerkUserId,
          email: normalizedEmail,
          name: name || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        clerkUserId,
        email: normalizedEmail,
        name: name || null,
        imageUrl: clerkUser.imageUrl || null,
      },
    });
  }

  private getAuthorizedParties() {
    const configured = this.config.get<string[]>('CLERK_AUTHORIZED_PARTIES') ?? [];
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    const authorizedParties = [frontendUrl, ...configured].filter(
      (value): value is string => Boolean(value)
    );

    return Array.from(new Set(authorizedParties));
  }

  private describeTokenForDebug(clerkSessionToken: string) {
    const decoded = this.decodeJwtForDebug(clerkSessionToken);
    const authorizedParties = this.getAuthorizedParties();

    if (!decoded) {
      return `tokenDebug={length:${clerkSessionToken.length}, decode:"failed", authorizedParties:${JSON.stringify(
        authorizedParties
      )}}`;
    }

    return `tokenDebug=${JSON.stringify({
      length: clerkSessionToken.length,
      kid: decoded.header.kid,
      alg: decoded.header.alg,
      typ: decoded.header.typ,
      iss: decoded.payload.iss,
      subPresent: Boolean(decoded.payload.sub),
      azp: decoded.payload.azp,
      aud: decoded.payload.aud,
      exp: decoded.payload.exp,
      authorizedParties,
    })}`;
  }

  private decodeJwtForDebug(clerkSessionToken: string) {
    const [encodedHeader, encodedPayload] = clerkSessionToken.split('.');

    if (!encodedHeader || !encodedPayload) return null;

    try {
      const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8')) as {
        alg?: string;
        kid?: string;
        typ?: string;
      };
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as {
        aud?: string | string[];
        azp?: string;
        exp?: number;
        iss?: string;
        sub?: string;
      };

      return { header, payload };
    } catch {
      return null;
    }
  }
}
