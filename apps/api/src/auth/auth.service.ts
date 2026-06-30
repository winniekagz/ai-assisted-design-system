import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async verifyAndSyncUser(token: string) {
    const secretKey = this.config.get<string>('CLERK_SECRET_KEY');

    if (!secretKey) {
      throw new UnauthorizedException('Authentication is not configured');
    }

    let clerkUserId: string;

    try {
      const payload = await verifyToken(token, { secretKey });
      clerkUserId = payload.sub;
    } catch {
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
}
