import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InviteStatus, Role, type Organization, type User } from '@prisma/client';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateOrganizationInviteDto } from './dto/create-organization-invite.dto';

@Injectable()
export class OrganizationInvitesService {
  constructor(
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService
  ) {}

  list(organizationId: string) {
    return this.prisma.organizationInvite.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        acceptedAt: true,
        createdAt: true,
        updatedAt: true,
        invitedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organization: Organization, invitedBy: User, dto: CreateOrganizationInviteDto) {
    if (dto.role === Role.OWNER) {
      throw new BadRequestException('Owner invites are not supported in V1');
    }

    const email = dto.email.toLowerCase();
    const existingMember = await this.prisma.organizationMember.findFirst({
      where: {
        organizationId: organization.id,
        user: { email },
      },
      select: { id: true },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this organization');
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const invite = await this.prisma.organizationInvite.create({
      data: {
        organizationId: organization.id,
        email,
        role: dto.role,
        tokenHash,
        invitedByUserId: invitedBy.id,
        expiresAt,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    });
    const inviteLink = this.buildInviteLink(token);
    const emailDelivery = await this.emailService.sendOrganizationInvite({
      to: email,
      inviteLink,
      organizationName: organization.name,
      invitedByName: invitedBy.name,
      invitedByEmail: invitedBy.email,
      role: dto.role,
    });

    return {
      invite,
      emailDelivery,
      ...(process.env.NODE_ENV === 'production' ? {} : { developmentInviteLink: inviteLink }),
    };
  }

  async validate(token: string) {
    const invite = await this.findUsableInvite(token);

    return {
      id: invite.id,
      role: invite.role,
      status: invite.status,
      expiresAt: invite.expiresAt,
      organization: invite.organization,
    };
  }

  async accept(token: string, user: User) {
    const invite = await this.findUsableInvite(token);

    if (!this.emailMatches(invite.email, user.email)) {
      throw new ForbiddenException('Invite can only be accepted by the invited email address');
    }

    const existingMember = await this.prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: invite.organizationId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this organization');
    }

    const result = await this.prisma.$transaction(async tx => {
      const latestInvite = await tx.organizationInvite.findUnique({
        where: { id: invite.id },
      });

      if (
        !latestInvite ||
        latestInvite.status !== InviteStatus.PENDING ||
        latestInvite.expiresAt <= new Date()
      ) {
        throw new BadRequestException('Invite is no longer available');
      }

      const membership = await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: invite.organizationId,
          role: invite.role,
        },
      });

      const acceptedInvite = await tx.organizationInvite.update({
        where: { id: invite.id },
        data: {
          status: InviteStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });

      return { membership, invite: acceptedInvite };
    });

    return {
      membership: result.membership,
      organization: invite.organization,
    };
  }

  private async findUsableInvite(token: string) {
    const tokenHash = this.hashToken(token);
    const invite = await this.prisma.organizationInvite.findUnique({
      where: { tokenHash },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is no longer pending');
    }

    if (invite.expiresAt <= new Date()) {
      await this.prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private buildInviteLink(token: string) {
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3001';
    return `${frontendUrl.replace(/\/$/, '')}/accept-invite?token=${token}`;
  }

  private emailMatches(inviteEmail: string, userEmail: string) {
    const inviteBuffer = Buffer.from(inviteEmail.toLowerCase());
    const userBuffer = Buffer.from(userEmail.toLowerCase());

    return (
      inviteBuffer.length === userBuffer.length &&
      timingSafeEqual(inviteBuffer, userBuffer)
    );
  }
}
